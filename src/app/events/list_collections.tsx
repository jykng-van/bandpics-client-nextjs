'use client'

import { use } from "react"

export const ListCollections = ({
    events,
}: {
    events: Promise<LiveEvent[]>
})=>{
    //console.log(groups);
    const allEvents = use(events);
    console.log(allEvents);



    return(
        <ul>
            {allEvents.map((event) => (
                <li key={event.id}>
                    <a href={`/events/${event.id}`}>{event.name}</a>
                </li>
            ))}
        </ul>
    )
}