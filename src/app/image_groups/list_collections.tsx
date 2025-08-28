'use client'

import { use } from "react"



export const ListCollections = ({
    groups,
}: {
    groups: Promise<ImageGroup[]>
})=>{
    //console.log(groups);
    const allGroups = use(groups);
    console.log(allGroups);



    return(
        <ul>
            {allGroups.map((group) => (
                <li key={group.id}>
                    <a href={`/image_groups/${group.id}`}>{group.name}</a>
                </li>
            ))}
        </ul>
    )
}