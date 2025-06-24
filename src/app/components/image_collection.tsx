'use client'

import Image from "next/image";

export default function ImageCollection({
    images, groupId, urlPath, clickCallback
}: {
    images: ImageData[] | null,
    groupId: string,
    urlPath: string,
    clickCallback: (image:ImageData)=>void
}){
    function thumb_url(filename: string): string {
        return `${urlPath}/thumb/${groupId}/${filename}`;
    }
    function fullsize_url(filename: string): string {
        return `${urlPath}/fullsize/${groupId}/${filename}`;
    }
    return (
    <div>
        {images && <div className="flex flex-wrap gap-2">
        {images.map((image) => (
          <div key={image.id}>
            <a href={fullsize_url(image.filename)} onClick={e=>{e.preventDefault(); clickCallback(image)}}><Image
              src={thumb_url(image.filename)}
              alt={image.filename}
              width={200}
              height={200}
            /></a>
          </div>
        ))}
      </div>}
    </div>
    )
}