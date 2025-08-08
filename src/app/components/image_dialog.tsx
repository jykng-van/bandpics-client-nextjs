'use client'

import Image from "next/image"
import { useEffect, useState } from "react";
import moment from "moment";
import { LocationMap } from "./location_map";
import Info from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { blue } from '@mui/material/colors';

export default function ImageDialog({
    image, groupId, closeImage
}:
{
    image: PictureData | null,
    groupId: string,
    closeImage: ()=>void
}){
    const urlPath = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
    const [showInfo, setShowInfo] = useState<boolean>(false);

    const closeDialog = ()=>{
        const dialog = document.querySelector('#image-dialog');
        if (dialog && dialog instanceof HTMLDialogElement){
            dialog.close();
            closeImage();
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

    const toggleInfo = ()=>{
        setShowInfo(!showInfo);
    }

    return (
    <dialog id="image-dialog" className="m-5 rounded-sm backdrop:bg-black/50 backdrop:backdrop-blur-sm relative flex flex-col">
        <button className="btn absolute top-2 right-5 bg-sky-300 p-1 rounded-full inline-block" onClick={closeDialog} title="Close"><CloseIcon sx={{color:'white'}} /></button>
        {image &&
        <div>
            <div className={'absolute top-0 left-0 p-3 transition duration-600 '+(showInfo ? 'bg-black/50':'bg-transparent')}>
                <div className="flex flex-row justify-start gap-4">
                    <button type="button" title="Additional Info" className="inline-block" onClick={toggleInfo}><Info sx={{color:blue[400]}} /></button>
                    {showInfo &&
                    <div className="text-white">
                        <h3 className="font-bold text-lg">{image.filename}</h3>
                        {image.data && image.data.DateTimeOriginal &&
                        <div className="">{moment(image.data.DateTimeOriginal).format('MMM DD, YYYY HH:mm:ss')}</div>}
                    </div>}
                </div>
                <div className={'transition-[height] duration-600 overflow-hidden '+(showInfo ? 'h-[25rem]':'h-0')}>
                {showInfo && image.data && image.data.coords && <LocationMap imageCoords={image.data.coords}></LocationMap>}
                </div>
            </div>

            <div className="p-2 flex-1 overflow-y-auto">
                <Image src={`${urlPath}/fullsize/${groupId}/${image.filename}`}
                    alt="Full size image"
                    width={1920}
                    height={1080}
                    className=""
                />
            </div>
            {image.description &&
            <div className="text-white bg-black/50 absolute bottom-0 p-2">{image.description}</div>}
            </div>
        }
    </dialog>
    )
}