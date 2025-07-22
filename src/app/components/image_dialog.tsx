'use client'

import Image from "next/image"
import { useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';

export default function ImageDialog({
    image, groupId, //closed = false
}:
{
    image: ImageData | null,
    groupId: string,
    //closed?: boolean
}){
    const urlPath = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
    function closeDialog(){
        const dialog = document.querySelector('#image-dialog');
        if (dialog && dialog instanceof HTMLDialogElement){
            dialog.close();
        }
    }
    useEffect(()=>{
        const dialog = document.querySelector('#image-dialog');
        if (dialog && dialog instanceof HTMLDialogElement){
            if (image !== null)
                dialog.showModal();
            else
                dialog.close();
        }
    }, [image]);
    console.log(image);

    return (
    <dialog id="image-dialog" className="m-5 rounded-sm  backdrop:bg-black/50 backdrop:backdrop-blur-sm">
        <button className="btn absolute top-2 right-5 bg-sky-300 p-1 rounded-full inline-block" onClick={closeDialog} title="Close"><CloseIcon sx={{color:'white'}} /></button>
        {image &&
        <div className="p-2">
            <h2 className="font-bold text-lg">{image.filename}</h2>
            <Image src={`${urlPath}/fullsize/${groupId}/${image.filename}`}
                alt="Full size image"
                width={1920}
                height={1080}
                className=""
            />
        </div>
        }
    </dialog>
    )
}