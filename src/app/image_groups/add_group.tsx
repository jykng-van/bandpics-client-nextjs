'use client';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'

export default function AddGroup({eventId}:{eventId?:string}){
    const session = useSession();
    const router = useRouter();

    return (
        <>
            {session.status === 'authenticated' &&
            <div className="py-4">
                <button type="button" className="btn text-white bg-blue-800 inline-block p-2"
                onClick={()=>router.push(`/image_groups/create?event=${eventId}`)}>Add Group</button>
            </div>}
        </>
    )
}