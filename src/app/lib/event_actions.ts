'use server'
import { revalidateTag } from "next/cache";
import { auth } from "@/app/helpers/auth";
import { HttpError } from "@/types/http_error";

const event_api = process.env.EVENT_API_URL;
const image_api = process.env.IMAGE_API_URL;

export const GetLiveEvent = async (eventId: string) : Promise<LiveEvent>=>{
    return fetch(`${event_api}/events/${eventId}`, {
        next:{
            tags:['event']
        }
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error('Error getting event,', err);
      });
}
export const UpdateLiveEvent = async (formData: FormData, event?: LiveEvent)=>{
    const session = await auth();
    console.log('updateevent session', session);
    const is_new_event = !event; //if it's a new event
    console.log('is new event', is_new_event);

    //data to send
    console.log('formData', formData);
    const event_data = {
        event:Object.fromEntries(formData.entries())
    };
    if (event_data.event['eventDate']==''){
        delete event_data.event['eventDate'];
    }
    console.log('event data', event_data);
    const id = event?.id;

    const url = `${event_api}/events` + (!is_new_event ? `/${id}`:'')
    console.log('url', url);
    console.log('Authorization', `Bearer ${session?.user.accessToken}`);

    const response = await fetch(
        url,
        {
            method: is_new_event ? 'POST' : 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.user.accessToken}`,
            },
            next:{
                tags:['event','event_list']
            },
            body: JSON.stringify(event_data),
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
export const GetAllLiveEvents = async ()=>{
    return fetch(`${event_api}/events`, {
        next:{
            tags:['event_list']
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
        console.error('Error getting events.', err);
    });
}
export const DeleteLiveEvent = async (eventId: string) =>{
    console.log('DELETE EVENT');
    const session = await auth();
    console.log(session);
    console.log(`Bearer ${session?.user.accessToken}`);

    return fetch(`${event_api}/events/${eventId}`, {
        method:'DELETE',
        headers: {
            'Authorization':`Bearer ${session?.user.accessToken}`
        },
        next:{
            tags:['event_list','event']
        }
    })
      .then(async (res) => {
        console.log('THEN', res);
        const res_data = await res.json();
        if (res.ok){
            revalidateTag('event_list');
            //disassociate images
            await fetch(`${image_api}/events/${eventId}/image_groups`,{
                method:'PATCH',
                headers: {
                    'Authorization':`Bearer ${session?.user.accessToken}`
                },
                next:{
                    tags:['image_groups']
                }
            }).then(()=>{
                revalidateTag('image_groups')
            })
            return JSON.stringify(res_data);
        }else{
            const error = new HttpError(res.statusText, res.status, res_data);
            return Promise.reject(error);
        }
      })
      .catch((err) => {
        console.error('Error deleting event,', err);
      });
}
export const RevalidateEvent = async ()=>{
    console.log('Revalidate event!');
    revalidateTag('event');
}