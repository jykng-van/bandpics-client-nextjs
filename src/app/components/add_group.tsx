'use client';
import { useSession } from "next-auth/react";

export default function AddGroup(){
    const session = useSession();

    return (
        <>
            {session.status === 'authenticated' &&
            <div className="py-4">
                <a className="btn text-white bg-blue-800 inline-block p-2" href="image_groups/create">Add Group</a>
            </div>}
        </>
    )
}