'use client';

import { useState } from "react";
import Image from "next/image";
import { UpdateImageGroup, RevalidateGroup } from "@/app/lib/group_actions";
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';


export default function ImageGroupForm({group}:{group?: ImageGroup}) {
    console.log('group', group);
    const api_url = process.env.NEXT_PUBLIC_IMAGE_API_URL;
    const [images, setImages] = useState<File[]>([]); //preview images to upload
    console.log('api_url', process.env.NEXT_PUBLIC_IMAGE_API_URL);


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        formData.delete('images'); //remove image from form data, handled separately
        UpdateImageGroup(formData, group)
        .then(async (group_data) => {

            console.log('Group data:', group_data);

            //get images
            if (images.length > 0){
                prepareImages(group_data.id);
            }else{
                //location.href = `/events/${res_data.id}`; //redirect or reload the page so that we see the changes
                await RevalidateGroup();
            }
        })
    }
    //prepare images to upload, the response sends back presigned urls
    async function prepareImages(id: string){
        const image_list : string[] = images.map((file)=> file.name);
        fetch(`${api_url}/images/${id}/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({images: image_list})
            }
        ).then(async (res) => {
            if (res.ok){
                const res_data = await res.json();
                console.log('Upload response:', res_data);

                const uploads: Promise<Response>[] = res_data.added_images.map(
                    (image: {presigned_url : string, type: string}, index: number) => fetch(image.presigned_url, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': image.type
                        },
                        body: images[index], //file to upload
                    }).catch((err)=>{
                        console.error('Error uploading image:', err);
                        return Promise.reject(err);
                    }))

                console.log('Uploads', uploads);
                Promise.all(uploads).then((res) => {
                    console.log('All uploads results', res);
                    if (res.every((r) => r.ok)) {
                        console.log('All image uploads successful');
                        setTimeout(()=>{
                            RevalidateGroup(); //revalidate group to show new images
                            setImages([]); //clear images from preview
                        }, 1500); // wait for resizing
                    }
                }).catch((err) => {
                    console.error('Error uploading images:', err);
                });
            } else {
                throw new Error('Failed to prepare image uploads');
            }
        })
    }
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        console.log('File change event');
        if (event.target.files && event.target.files.length > 0){
            const files = event.target.files;
            console.log('Files', files);
            for(let i=0; i<files.length; i++){ //append to preview images
                setImages((prevImages) => [...prevImages, files[i]]);
            }
        }
    }
    function handleDrop(event: React.DragEvent<HTMLDivElement>){
        console.log('Drop event');
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files.length){
            const files = event.dataTransfer.files;
            console.log('Dropped files', files);
            for(let i=0; i<files.length; i++){ //append to preview images
                setImages((prevImages) => [...prevImages, files[i]]);
            }
        }
    }

    function handleRemoveImage(index: number){
        setImages((prevImages) => {
            return prevImages.filter((img, i) => i !== index); //remove at index
        });
    }

    return(
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="font-bold block" htmlFor="groupName">Name</label>
                <input className="border border-gray-500 rounded-xs" type="text" id="groupName" name="name" defaultValue={group?.name} />
            </div>
            <div className="mb-3">
                <label className="font-bold block" htmlFor="groupDescription">Description</label>
                <textarea className="border border-gray-500 rounded-xs" id="groupDescription" name="description" defaultValue={group?.description}></textarea>
            </div>
            <div className="border-3 border-dashed border-gray-500 rounded p-3 mb-3">
                <div id="preview-images" className="flex flex-wrap gap-2 flex-row">
                    {images.map((file, index)=>
                    <div key={('file'+index)} className="relative">
                        <button title="remove" type="button" className="absolute right-1 top-1" onClick={()=>handleRemoveImage(index)}>
                            <HighlightOffTwoToneIcon style={{color:'#f00'}} />
                        </button>
                        <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            width={200}
                            height={200}
                        >
                        </Image>
                    </div>)}
                </div>
                <div id="add-images" className="flex justify-center items-center flex-col" onDrop={handleDrop} onDragOver={(e)=>e.preventDefault()}>
                    <strong>Add Images</strong>
                    <div>or</div>
                    <label className="font-bold text-white bg-blue-800 p-2 inline-block" htmlFor="file-picker">Click Here</label>
                    <input className="invisible size-0" type="file" id="file-picker" name="images" multiple accept="image/jpg, image/jpeg" onChange={handleFileChange} />
                </div>

            </div>
            <button className="font-bold text-white bg-blue-800 p-2 inline-block rounded-sm" type="submit">Save</button>
        </form>
    )
}