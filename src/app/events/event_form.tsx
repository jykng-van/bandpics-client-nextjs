'use client';

import { useState, useContext, useEffect } from "react";
import { UpdateLiveEvent, DeleteLiveEvent, RevalidateEvent } from "@/app/lib/event_actions";
import DeleteIcon from '@mui/icons-material/Delete';
import { DialogContext } from '@/app/components/confirm_dialog';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";



export const EventForm = ({liveEvent}:{liveEvent?: LiveEvent}) => {
    console.log('event', liveEvent);
    const api_url = process.env.NEXT_PUBLIC_EVENT_API_URL;
    console.log('api_url', api_url);
    const session = useSession();
    const dialog_context = useContext(DialogContext) as DialogContextProp;
    const [result, setResult] = useState<RequestResult | null>(null);
    const router = useRouter();

    useEffect(()=>{

    }, []);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        console.log('formData', formData);

        UpdateLiveEvent(formData, liveEvent)
        .then(async (event_data) => {

            console.log('Event data:', event_data);
            if (liveEvent){
                await RevalidateEvent();
            }else{
                router.push(`/events/${event_data.id}`); //redirect or reload the page so that we see the changes
            }
        })
    }

    const handleDeleteEvent = async (liveEvent: LiveEvent)=>{
        //const image_id = group_image?.dataset.id; //get image id
        const event_id = liveEvent.id;
        console.log('Delete Event', liveEvent.id);
        console.log(dialog_context);
        if (await dialog_context.showConfirmation(`Are you sure you want to delete this event: ${liveEvent.name}?`)){
            await DeleteLiveEvent(event_id || '').then((res)=>{
                console.log('DeleteLiveEvent', res);
                router.push('/');
            })
            .catch((err)=>{
                setResult({message:err.message, fail:true});
                console.log('CATCH');
                console.error(err.message);
            });

        }

    }

    return(
        <>
        {session.status == 'authenticated'  && <form onSubmit={handleSubmit}>
            {session.status == 'authenticated' && liveEvent &&
                <button className="text-white bg-red-600 inline-block py-2 px-4" onClick={()=>{handleDeleteEvent(liveEvent)}}>Delete Live Event <DeleteIcon /></button>
            }
            {result?.message && <div id="group-result" className={'border fixed top-5 m-auto py-1 px-3 left-1/2 -translate-x-1/2 inline-block '
            + (result.fail ? 'bg-red-200':'bg-green-200')}>{result.message}</div>}
            <div className="mb-3">
                <label className="font-bold block" htmlFor="eventName">Name</label>
                <input className="border border-gray-500 rounded-xs w-full" type="text" id="eventName" name="name" defaultValue={liveEvent?.name} />
            </div>
            <div className="mb-3">
                <label className="font-bold block" htmlFor="eventDescription">Description</label>
                <textarea className="border border-gray-500 rounded-xs w-full" id="eventDescription" name="description" defaultValue={liveEvent?.description}></textarea>
            </div>
            <div className="mb-3">
                <label className="font-bold block" htmlFor="event_date">Event Date</label>
                <input className="border border-gray-500 rounded-xs w-full" type="date" id="event_date" name="event_date" defaultValue={liveEvent?.event_date} />
            </div>

            <button className="font-bold text-white bg-blue-800 p-2 inline-block rounded-sm" type="submit">Save</button>
        </form>}
        </>
    )
}