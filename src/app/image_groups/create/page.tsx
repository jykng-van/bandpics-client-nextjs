import ImageGroupForm from "@/app/image_groups/group_form";
import { getServerSession } from "next-auth/next"

export default async function CreateImageGroup() {
    //const imageGroup = use(group);
    const session = await getServerSession();
    console.log('Session', session);

    return(
        <>
            <h2 className="font-bold text-lg">Create/Edit Image Group</h2>
            <ImageGroupForm />
        </>
    )
}