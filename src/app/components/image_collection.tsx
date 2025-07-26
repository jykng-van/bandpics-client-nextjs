'use client'

import Image from "next/image";
import DeleteIcon from '@mui/icons-material/Delete';
import { useSession } from "next-auth/react";
import { DeleteImage } from "@/app/lib/image_actions";
import { useContext } from 'react';
import { DialogContext } from './confirm_dialog';


export default function ImageCollection({
    images, groupId, clickCallback
}: {
    images: ImageData[] | null,
    groupId: string,
    clickCallback: (image:ImageData)=>void
}){
    const session = useSession();
    const dialog_context = useContext(DialogContext) as DialogContextProp;

    const urlPath = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
    //const api_url = process.env.NEXT_PUBLIC_IMAGE_API_URL;

    function thumb_url(filename: string): string {
        return `${urlPath}/thumb/${groupId}/${filename}`;
    }
    function fullsize_url(filename: string): string {
        return `${urlPath}/fullsize/${groupId}/${filename}`;
    }

    async function handleDeleteImage(event: React.MouseEvent<HTMLButtonElement>){
      const group_image = event.currentTarget.closest('.group-image');
      if (group_image && group_image instanceof HTMLElement){
        const image_id = group_image?.dataset.id;
        console.log('Delete image', image_id);
        console.log(dialog_context);
        if (await dialog_context.showConfirmation('Are you sure you want to delete this?')){
          await DeleteImage(image_id || '');
        }
      }
    }
    return (
    <div>
        {images && <div className="flex flex-wrap gap-2">
        {images.map((image) => (
          <div className="group-image" key={image.id} data-id={image.id}>
            <a href={fullsize_url(image.filename)} onClick={e=>{e.preventDefault(); clickCallback(image)}} className="block">
              <Image
              src={thumb_url(image.filename)}
              alt={image.filename}
              title={image.description || ''}
              width={200}
              height={200}
              />
            </a>
            {session.status === 'authenticated' &&
            <div>
              <button onClick={handleDeleteImage}><DeleteIcon /></button>
            </div>}
          </div>
        ))}
      </div>}
    </div>
    )
}