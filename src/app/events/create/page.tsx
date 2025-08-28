import EventForm from "@/app/events/event_form";
//import { getServerSession } from "next-auth/next";


export default async function CreateImageGroup() {
    //const imageGroup = use(group);

    return(
        <>
            <h2 className="font-bold text-lg">Create/Edit Live Event</h2>
            <EventForm />
        </>
    )
}