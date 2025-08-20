'use server'
import { revalidateTag } from "next/cache";
import { auth } from "@/app/helpers/auth";
import { HttpError } from "@/types/http_error";

const image_api = process.env.IMAGE_API_URL;

export const GetImageGroup = async (groupId: string) : Promise<ImageGroup>=>{
    return fetch(`${image_api}/image_groups/${groupId}`, {
        next:{
            tags:['group','image']
        }
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error('Error getting image group,', err);
      });
}
export const UpdateImageGroup = async (formData: FormData, group?: ImageGroup)=>{
    //const is_new_group = formData.get('id') == ''; //if it's a new group
    const session = await auth();
    console.log('updateimagegroup session', session);
    const is_new_group = !group; //if it's a new group
    console.log('is new group', is_new_group);

    //data to send
    console.log('formData', formData);
    const group_data = {
        group:{
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            images:is_new_group ? formData.getAll('images[]') : [],
        }
    };

    console.log('group data', group_data);
    const id = group?.id;

    const url = `${image_api}/image_groups` + (!is_new_group ? `/${id}`:'');
    console.log('url', url);

    const response = await fetch(
        url,
        {
            method: is_new_group ? 'POST' : 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.user.accessToken}`,
            },
            body: JSON.stringify(group_data),
        }
    )
    const result = await response.json();
    console.log(result);
    if (response.ok){
        return result;
    }else{
        const error = new HttpError(response.statusText, response.status);
        return error;
    }

}
export const GetAllGroups = async ()=>{
    return fetch(`${image_api}/image_groups`, {
        next:{
            tags:['image_groups']
        }
    })
    .then(async (res) => {
        if (res.ok){
            const res_data = await res.json();
            return Promise.resolve(res_data);
        }else{
            const error = new HttpError(res.statusText, res.status);
            return Promise.reject(error);
        }

    })
    .catch((err) => {
        console.error('Error getting groups.', err);
    });
}
export const DeleteImageGroup = async (groupId: string) =>{
    console.log('DELETE IMAGEGROUP');
    const session = await auth();
    console.log(session);
    console.log(`Bearer ${session?.user.accessToken}`);

    return fetch(`${image_api}/image_groups/${groupId}`, {
        method:'DELETE',
        headers: {
            'Authorization':`Bearer ${session?.user.accessToken}`
        },
        next:{
            tags:['group']
        }
    })
      .then(async (res) => {
        console.log('THEN', res);
        const res_data = await res.json();
        if (res.ok){
            revalidateTag('group');
            return JSON.stringify(res_data);
        }else{
            const error = new HttpError(res.statusText, res.status, res_data);
            return Promise.reject(error);
        }
      })
      .catch((err) => {
        console.error('Error deleting image group,', err);
      });
}
export const RevalidateGroup = async ()=>{
    console.log('Revalidate group!');
    revalidateTag('group');
}
