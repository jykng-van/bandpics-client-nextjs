'use client'

import { use, useContext, useState } from "react"
import { useSession } from "next-auth/react";
import DeleteIcon from '@mui/icons-material/Delete';
import { DialogContext } from '@/app/components/confirm_dialog';
import { DeleteImageGroup } from "@/app/lib/group_actions";

export const ListCollections = ({
    groups,
}: {
    groups: Promise<ImageGroup[]>
})=>{
    //console.log(groups);
    const allGroups = use(groups);
    const session = useSession();
    const dialog_context = useContext(DialogContext) as DialogContextProp;
    const [result, setResult] = useState<RequestResult | null>(null);

    console.log(allGroups);

    const handleDeleteGroup = async (group: ImageGroup)=>{
        //const image_id = group_image?.dataset.id; //get image id
        const group_id = group.id;

        console.log('Delete Group', group_id);
        console.log(dialog_context);
        if (await dialog_context.showConfirmation(`Are you sure you want to delete the group: ${group.name}?`)){
            await DeleteImageGroup(group_id || '').then(async(res)=>{
                console.log('DeleteImageGroup', res);
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
            {result?.message && <div id="group-result" className={'border fixed top-5 m-auto py-1 px-3 left-1/2 -translate-x-1/2 inline-block '
          + (result.fail ? 'bg-red-200':'bg-green-200')}>{result.message}</div>}
            <ul>
                {allGroups.map((group) => (
                    <li key={group.id}>
                        <a href={`/events/${group.id}`}>{group.name}</a>
                        {session.status == 'authenticated' &&
                        <button onClick={()=>{handleDeleteGroup(group)}} title="Delete Group"><DeleteIcon /></button>
                        }
                    </li>
                ))}
            </ul>
        </>
    )
}