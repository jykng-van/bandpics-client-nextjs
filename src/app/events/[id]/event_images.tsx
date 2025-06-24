'use client'

import { useState, use } from 'react';

import ImageCollection from '@/app/components/image_collection';
import ImageDialog from '@/app/components/image_dialog';

export default function EventImages({
    group, cloudfront_url,
}:{
    group:Promise<ImageGroup>,
    cloudfront_url: string,
}){
    const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
    const imageGroup = use(group);

    function change_current_image(image:ImageData):void{
        setCurrentImage(image);
    }
    console.log(imageGroup);
    return (
        <>
            <ImageCollection images={imageGroup.images || null} urlPath={cloudfront_url} groupId={imageGroup.id} clickCallback={change_current_image} />
            <ImageDialog image={currentImage} urlPath={cloudfront_url} groupId={imageGroup.id} />
        </>
    );
}