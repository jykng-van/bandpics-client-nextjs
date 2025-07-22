import ImageGroupForm from "@/app/image_groups/group_form";

export default function CreateImageGroup() {
    //const imageGroup = use(group);
    return(
        <>
            <h2 className="font-bold text-lg">Create/Edit Image Group</h2>
            <ImageGroupForm />
        </>
    )
}