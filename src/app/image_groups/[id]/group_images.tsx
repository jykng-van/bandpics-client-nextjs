'use client'

import { useState } from 'react';
import { useSession } from "next-auth/react";
import { ImageCollection } from '@/app/components/image_collection';
import { ImageDialog } from '@/app/components/image_dialog';
import { ImageGroupForm } from '@/app/image_groups/group_form';
import EditIcon from '@mui/icons-material/Edit';

export const GroupImages = ({
    imageGroup,
}:{
    //group:Promise<ImageGroup>,
    imageGroup:ImageGroup,
})=>{
    const [currentImage, setCurrentImage] = useState<PictureData | null>(null);
    //const imageGroup = use(group);

    const session = useSession();
    console.log(session);
    const change_current_image = (image:PictureData):void =>{
        setCurrentImage(image);
    }
    const close_image = ():void =>{
        setCurrentImage(null);
    }
    console.log(imageGroup);
    return (
        <>
            <ImageCollection images={imageGroup.images || null} groupId={imageGroup.id} clickCallback={change_current_image} />
            {session.status === 'authenticated' &&
            <div className="py-4">
                <div className="font-bold text-lg mb-2">Edit Image Group <EditIcon /></div>
                <ImageGroupForm group={imageGroup} />
            </div>
            }
            {currentImage &&
            <ImageDialog image={currentImage}  groupId={imageGroup.id} closeImage={close_image} />}
        </>
    );
}