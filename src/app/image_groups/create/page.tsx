import { ImageGroupForm } from "@/app/image_groups/group_form";
//import { getServerSession } from "next-auth/next";


const CreateImageGroup = async() => {
    //const imageGroup = use(group);

    return(
        <>
            <h2 className="font-bold text-lg">Create/Edit Image Group</h2>
            <ImageGroupForm />
        </>
    )
}
export default CreateImageGroup;