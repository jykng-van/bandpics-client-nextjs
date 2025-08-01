
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import UploadIcon from '@mui/icons-material/Upload';

export const ImageEditDialog = (
    {imageData, groupId, closeEdit }:{imageData:ImageData, groupId:string, closeEdit: () => void}
)=>{
    console.log('image edit', imageData);

    const urlPath = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
    const editDialog = useRef<HTMLDialogElement>(null);


    const [newImage, setNewImage] = useState<File | null>(null);

    const img_url = (filename: string): string => {
        return `${urlPath}/fullsize/${groupId}/${filename}`;
    }
    const [previewImage, setPreviewImage] = useState<string>(img_url(imageData.filename));

    useEffect(()=>{
        if (editDialog && editDialog.current){
            if (imageData !== null){
                editDialog.current.showModal();
            }

        }
    }, [imageData]);

    const handleReplaceFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('File change event');
        if (event.target.files && event.target.files.length > 0){
            const files = event.target.files;
            console.log('Files', files);
            setNewImage(files[0]);
            setPreviewImage(URL.createObjectURL(files[0]));
        }
    }
    const handleReplaceDrop = (event: React.DragEvent<HTMLDivElement>) => {
        console.log('Drop event');
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files.length){
            const files = event.dataTransfer.files;
            console.log('Dropped files', files);
            setNewImage(files[0]);
            setPreviewImage(URL.createObjectURL(files[0]));
        }
    }

    const handleSaveImage = (event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
    }


    return (
    <dialog id="image-edit-dialog" ref={editDialog} className="relative bg-white p-4 rounded-md shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm fixed m-auto box-border">
        <form className="flex flex-col items-center" onSubmit={handleSaveImage}>
            <h4 className="font-bold text-lg">Editing Image</h4>
            <button className="btn absolute top-2 right-5 bg-sky-300 p-1 rounded-full inline-block" onClick={closeEdit} title="Close"><CloseIcon sx={{color:'white'}} /></button>

            <div className="flex-1 w-full" onDrop={handleReplaceDrop} onDragOver={(e)=>e.preventDefault()}>
                <Image src={previewImage} alt={imageData.filename} width={800} height={600} className="object-contain" />
            </div>

            <div className="mt-4">
                <label className="font-bold text-white bg-blue-800 p-2 inline-block" htmlFor="file-replacer"><UploadIcon /> Replace Image</label>
                <input className="invisible size-0" type="file" id="file-replacer" name="images" multiple accept="image/jpg, image/jpeg" onChange={handleReplaceFile} />
            </div>

            <div className="w-full">
                <label htmlFor="image-description" className="font-bold block">Description</label>
                <textarea id="image-description" className="border border-gray-500 rounded-xs w-full h-[3em]" defaultValue={imageData.description}></textarea>
            </div>

            <div className="flex flex-row gap-4 justify-center">
                <button className="font-bold text-white bg-gray-800 p-2 inline-block rounded-sm" type="button" onClick={closeEdit}>Cancel</button>
                <button className="font-bold text-white bg-blue-800 p-2 inline-block rounded-sm" type="submit">Save</button>
            </div>

        </form>
    </dialog>
    )
}