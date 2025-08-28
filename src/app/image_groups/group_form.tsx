'use client';

import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { UpdateImageGroup, DeleteImageGroup, RevalidateGroup } from "@/app/lib/group_actions";
import { GetAllLiveEvents } from "../lib/event_actions";
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import { DialogContext } from '@/app/components/confirm_dialog';
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";



export default function ImageGroupForm({group}:{group?: ImageGroup}) {
    console.log('group', group);
    const api_url = process.env.NEXT_PUBLIC_IMAGE_API_URL;
    const [images, setImages] = useState<File[]>([]); //preview images to upload
    console.log('api_url', process.env.NEXT_PUBLIC_IMAGE_API_URL);
    const session = useSession();
    const dialog_context = useContext(DialogContext) as DialogContextProp;
    const [result, setResult] = useState<RequestResult | null>(null);
    const router = useRouter();

    const [selectedEvent, setSelectedEvent] = useState<string>(group?.event || '');
    const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);

    const searchParams = useSearchParams();

    useEffect(()=>{
        const initEvents = async ()=>{
            setLiveEvents(await GetAllLiveEvents()); //load live events
        }
        initEvents();
        if (searchParams.has('event') && searchParams.get('event') != ''){
            console.log('event', searchParams.get('event'));
            setSelectedEvent(searchParams.get('event') || '');
        }
    }, [searchParams]);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        console.log('formData', formData);
        console.log('images', images);

        formData.delete('images'); //remove image from form data, handled separately
        if (!group){
            images.forEach(image=>{
                formData.append('images[]', image.name);
            });
        }
        console.log('formData', formData);
        UpdateImageGroup(formData, group)
        .then(async (group_data) => {

            console.log('Group data:', group_data);
            if (group){
                //get images
                if (images.length > 0){
                    prepareImages(group_data.id);
                }else{
                    await RevalidateGroup();
                }
            }else{
                uploadToPresigned(group_data.images, group_data.group_id);
            }
        })
    }
    //prepare images to upload, the response sends back presigned urls
    const prepareImages = async (id: string)=>{
        console.log('prepareImages, ID:',id);
        const image_list : string[] = images.map((file)=> file.name);
        fetch(`${api_url}/images/${id}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.data?.user?.accessToken}`
                },
                body: JSON.stringify({images: image_list})
            }
        ).then(async (res) => {
            const res_data = await res.json();
            console.log('Upload response:', res_data);

            uploadToPresigned(res_data.added_images);
        })
    }
    const uploadToPresigned = (presigned_urls:{presigned_url : string, type: string}[], group_id?:string)=>{
        console.log('uploadToPresigned', presigned_urls);
        const uploads: Promise<Response>[] = presigned_urls.map(
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
                    if (group){
                        RevalidateGroup(); //revalidate group to show new images
                        setImages([]); //clear images from preview
                    }else{
                        const redirect_id = selectedEvent || group_id;
                        router.push(`/events/${redirect_id}`); //redirect or reload the page so that we see the changes
                    }

                }, 1500); // wait for resizing
            }
        }).catch((err) => {
            console.error('Error uploading images:', err);
        });
    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        console.log('File change event');
        if (event.target.files && event.target.files.length > 0){
            const files = event.target.files;
            console.log('Files', files);
            for(let i=0; i<files.length; i++){ //append to preview images
                setImages((prevImages) => [...prevImages, files[i]]);
            }
        }
    }
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) =>{
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

    const handleRemoveImage = (index: number)=>{
        setImages((prevImages) => {
            return prevImages.filter((img, i) => i !== index); //remove at index
        });
    }

    const handleDeleteGroup = async (group: ImageGroup)=>{
        //const image_id = group_image?.dataset.id; //get image id
        const group_id = group.id;

        console.log('Delete Group', group_id);
        console.log(dialog_context);
        if (await dialog_context.showConfirmation(`Are you sure you want to delete the group: ${group.name}?`)){
            await DeleteImageGroup(group_id || '').then((res)=>{
                console.log('DeleteImageGroup', res);
                router.push('/');
            })
            .catch((err)=>{
                setResult({message:err.message, fail:true});
                console.log('CATCH');
                console.error(err.message);
            });

        }

    }

    return(
        <form onSubmit={handleSubmit}>
            {session.status == 'authenticated' && group &&
                <button className="text-white bg-red-600 inline-block py-2 px-4" onClick={()=>{handleDeleteGroup(group)}}>Delete Image Group <DeleteIcon /></button>
            }
            {result?.message && <div id="group-result" className={'border fixed top-5 m-auto py-1 px-3 left-1/2 -translate-x-1/2 inline-block '
            + (result.fail ? 'bg-red-200':'bg-green-200')}>{result.message}</div>}
            <div className="mb-3">
                <label className="font-bold block" htmlFor="groupName">Name</label>
                <input className="border border-gray-500 rounded-xs w-full" type="text" id="groupName" name="name" defaultValue={group?.name} />
            </div>
            <div className="mb-3">
                <label className="font-bold block" htmlFor="groupDescription">Description</label>
                <textarea className="border border-gray-500 rounded-xs w-full" id="groupDescription" name="description" defaultValue={group?.description}></textarea>
            </div>
            <div className="mb-3">
                <label className="font-bold block" htmlFor="groupEvent">Event</label>
                <select className="border border-gray-500 rounded-xs w-full" id="groupEvent" name="event"
                value={selectedEvent} onChange={(e)=>setSelectedEvent(e.target.value)}>
                    <option value="">Choose Live Event</option>
                    {liveEvents.map(e=>(<option value={e.id} key={e.id}>{e.name}</option>))}
                </select>
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