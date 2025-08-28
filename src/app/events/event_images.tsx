'use client'

import { useState, useContext } from 'react';
import { useSession } from "next-auth/react";
import ImageCollection from '@/app/components/image_collection';
import ImageDialog from '@/app/components/image_dialog';
import Link from 'next/link';

import { DialogContext } from '@/app/components/confirm_dialog';
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteImageGroup } from '../lib/group_actions';

//import ImageGroupForm from '@/app/image_groups/group_form';
//import EditIcon from '@mui/icons-material/Edit';

export default function EventImages({
    groups,
}:{
    //group:Promise<ImageGroup>,
    groups:ImageGroup[],
}){
    const [currentImage, setCurrentImage] = useState<PictureData | null>(null);
    const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
    const [result, setResult] = useState<RequestResult | null>(null);
    //const imageGroup = use(group);

    const dialog_context = useContext(DialogContext) as DialogContextProp;

    const session = useSession();
    console.log(session);
    const change_current_image = (image: PictureData, groupId?: string): void => {
        setCurrentImage(image);
        setCurrentGroupId(groupId ?? null);
    }
    const close_image = ():void =>{
        setCurrentImage(null);
    }
    const handleDeleteGroup = async (group: ImageGroup)=>{
        //const image_id = group_image?.dataset.id; //get image id
        const group_id = group.id;

        console.log('Delete Group', group_id);
        console.log(dialog_context);
        if (await dialog_context.showConfirmation(`Are you sure you want to delete the group: ${group.name}?`)){
            await DeleteImageGroup(group_id || '').then((res)=>{
                console.log('DeleteImageGroup', res);
                setResult({message:'Image group delete!'});
                //router.push('/');
            })
            .catch((err)=>{
                setResult({message:err.message, fail:true});
                console.log('CATCH');
                console.error(err.message);
            });

        }

    }
    console.log(groups);
    return (
        <>
            {result?.message && <div id="group-result" className={'border fixed top-5 m-auto py-1 px-3 left-1/2 -translate-x-1/2 inline-block '
            + (result.fail ? 'bg-red-200':'bg-green-200')}>{result.message}</div>}
            {groups && groups.map(g=>(
                <figure key={g.id} className="border-t my-5">
                    <h2 className="text-lg font-bold">
                        <Link href={`/image_groups/${g.id}`}>{g.name}</Link>
                    </h2>
                    {session.status == 'authenticated' && <button type="button" className="cursor-pointer" onClick={()=>handleDeleteGroup(g)}><DeleteIcon /></button>}
                    {g.description && <figcaption>{g.description}</figcaption>}
                    <ImageCollection images={g.images || null} groupId={g.id} clickCallback={change_current_image} />
                </figure>)
            )}
            {currentImage && currentGroupId &&
            <ImageDialog image={currentImage}  groupId={currentGroupId} closeImage={close_image} />}
        </>
    );
}