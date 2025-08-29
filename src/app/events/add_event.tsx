'use client';
import { useSession } from "next-auth/react";

export const AddEvent = ()=>{
    const session = useSession();

    return (
        <>
            {session.status === 'authenticated' &&
            <div className="py-4">
                <a className="btn text-white bg-blue-800 inline-block p-2" href="events/create">Add Event</a>
            </div>}
        </>
    )
}