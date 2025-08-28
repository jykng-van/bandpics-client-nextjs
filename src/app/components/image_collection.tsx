'use client'

import Image from "next/image";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSession } from "next-auth/react";
import { DeleteImage } from "@/app/lib/image_actions";
import { useContext, useState } from 'react';
import { DialogContext } from './confirm_dialog';
import { ImageEditDialog } from "./image_edit_dialog";


export default function ImageCollection({
    images, groupId, clickCallback
}: {
    images: PictureData[] | null,
    groupId: string,
    clickCallback: (image:PictureData, groupId?:string)=>void
}){
    const session = useSession();
    const dialog_context = useContext(DialogContext) as DialogContextProp;
    const [result, setResult] = useState<RequestResult | null>(null);
    const [editImage, setEditImage] = useState<PictureData | null>(null);

    const urlPath = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
    //const api_url = process.env.NEXT_PUBLIC_IMAGE_API_URL;

    const thumb_url = (filename: string): string => {
        return `${urlPath}/thumb/${groupId}/${filename}`;
    }
    const fullsize_url = (filename: string): string => {
        return `${urlPath}/fullsize/${groupId}/${filename}`;
    }

    const handleDeleteImage = async (event: React.MouseEvent<HTMLButtonElement>)=>{
      const group_image = event.currentTarget.closest('.group-image'); //get the container which has a data attribute
      if (group_image && group_image instanceof HTMLElement){
        const image_id = group_image?.dataset.id; //get image id
        console.log('Delete image', image_id);
        console.log(dialog_context);
        if (await dialog_context.showConfirmation('Are you sure you want to delete this?')){
          await DeleteImage(image_id || '').then((res)=>{
            console.log(res);

          })
          .catch((err)=>{
            setResult({message:err.message, fail:true});
            console.log('CATCH');
            console.error(err.message);
          });

        }
      }
    }
    const openEditImage = async (event: React.MouseEvent<HTMLButtonElement>)=>{
      const group_image = event.currentTarget.closest('.group-image'); //get the container which has a data attribute
      if (group_image && group_image instanceof HTMLElement){
        const image_id = group_image?.dataset.id; //get image id
        const image = images?.find(i=>i.id == image_id);
        console.log('openEditImages', image);
        if (image){
          setEditImage(image);
        }
      }
    }
    const clearEditImage = ()=>{
      setEditImage(null);
    }
    return (
    <section>
        {result?.message && <div id="group-result" className={'border fixed top-5 m-auto py-1 px-3 left-1/2 -translate-x-1/2 inline-block '
          + (result.fail ? 'bg-red-200':'bg-green-200')}>{result.message}</div>}
        {images && <div className="flex flex-wrap gap-2">
        {images.map((image) => (
          <div className="group-image" key={image.id} data-id={image.id}>
            <a href={fullsize_url(image.filename)} onClick={e=>{e.preventDefault(); clickCallback(image, groupId)}} className="block">
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
              <button onClick={handleDeleteImage} title="Delete Image"><DeleteIcon /></button>
              <button onClick={openEditImage} title="Edit Image"><EditIcon /></button>
            </div>}
          </div>
        ))}
      </div>}
      {session.status === 'authenticated' && editImage!==null &&
      <ImageEditDialog PictureData={editImage} groupId={groupId} closeEdit={clearEditImage}></ImageEditDialog>
      }
    </section>
    )
}