import { EventForm } from "@/app/events/event_form";
//import { getServerSession } from "next-auth/next";


const CreateImageGroup = async () => {
    //const imageGroup = use(group);

    return(
        <>
            <h2 className="font-bold text-lg">Create/Edit Live Event</h2>
            <EventForm />
        </>
    )
}
export default CreateImageGroup;