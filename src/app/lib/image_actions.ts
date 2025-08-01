'use server'
import { revalidateTag } from "next/cache";
import { auth } from "@/app/helpers/auth";
import { HttpError } from "@/types/http_error";

const api_url = process.env.IMAGE_API_URL;


export const DeleteImage = async (image_id: string) => {
    // Update data
    console.log('DELETE IMAGE');
    const session = await auth();
    console.log(session);
    console.log(`Bearer ${session?.user.accessToken}`);
    await fetch(`${api_url}/images/${image_id}`,{
        method: 'DELETE',
        headers: {
            'Authorization':`Bearer ${session?.user.accessToken}`
        },
        next:{
            tags:['group','image']
        }
    }).then((res)=>{
        console.log('THEN', res);
        if (res.ok){
            revalidateTag('group');
            return JSON.stringify(res.json());
        }else{
            const error = new HttpError(res.statusText, res.status);
            return Promise.reject(error);
            //return {error:res.statusText}
        }
    })
}
//export const EditImage = async ()