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
        }
    }).catch((err) => {
        console.error('Error deleting image.', err);
    });
}
export const UpdateImage = async (image_id:string, form_data:FormData) =>{
    const session = await auth();
    const data = {data: Object.fromEntries(form_data)};
    console.log(image_id);
    console.log(JSON.stringify(data));
    console.log(`Bearer ${session?.user.accessToken}`);
    return fetch(`${api_url}/images/${image_id}`,{
        method: 'PATCH',
        headers: {
            'Authorization':`Bearer ${session?.user.accessToken}`,
            'Content-Type': 'application/json',
        },
        next:{
            tags:['image','group']
        },
        body:JSON.stringify(data)
    }).then(async (res)=>{
        console.log('THEN', res);
        const res_data = await res.json();
        if (res.ok){
            //revalidateTag('image');
            //return JSON.stringify(res.json());
            revalidateTag('group');
            return Promise.resolve(res_data);
        }else{
            const error = new HttpError(res.statusText, res.status, res_data);
            console.error(res_data);
            return Promise.reject(error);
        }
    }).catch((err) => {
        console.error('Error updating image.', err);
    });
}