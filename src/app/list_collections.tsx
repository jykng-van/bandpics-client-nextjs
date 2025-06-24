'use client'

import { use } from "react"


export default function ListCollections({
    groups,
}: {
    groups: Promise<ImageGroup[]>
}){
    console.log(groups);
    const allGroups = use(groups);


    return(
        <ul>
            {allGroups.map((group) => (
                <li key={group.id}>
                    <a href={`/events/${group.id}`}>{group.name}</a>
                </li>
            ))}
        </ul>
    )
}