'use client';

import { useRef, use } from "react";

export default function ImageGroupForm({group}:{group?: ImageGroup}) {
    console.log(group);
    const api_url = process.env.NEXT_PUBLIC_IMAGE_API_URL;
    console.log('api_url', process.env.NEXT_PUBLIC_IMAGE_API_URL);


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const is_new_group = !group; //if it's a new group
        console.log('is new group', is_new_group);
        const formData = new FormData(event.currentTarget);
        //data to send
        let group_data = {
            group:{
                name: formData.get('name') as string,
                description: formData.get('description') as string,
            }
        };
        const id = group?.id || '';
        //get images
        fetch(
            `${api_url}/image_groups/${id}`,
            {
                method: is_new_group ? 'POST' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(group_data),
            }
        ).then(async (res) => {
            console.log('Response:', res);
            if (res.ok) {
                const res_data = await res.json();
                console.log('Response data:', res_data);
                location.href = `/events/${res_data.id}`; //redirect or reload the page so that we see the changes
            } else {
                throw new Error('Failed to save group');
            }
        })
    }
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {

    }

    return(
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="font-bold block" htmlFor="groupName">Name</label>
                <input className="border border-gray-500 rounded-xs" type="text" id="groupName" name="name" defaultValue={group?.name} />
            </div>
            <div className="mb-3">
                <label className="font-bold block" htmlFor="groupDescription">Description</label>
                <textarea className="border border-gray-500 rounded-xs" id="groupDescription" name="description" defaultValue={group?.description}></textarea>
            </div>
            <div className="border-3 border-dashed border-gray-500 rounded p-3 mb-3 flex justify-center items-center flex-col">
                <div id="preview-images"></div>
                <strong>Add Images</strong>
                <div>or</div>
                <label className="font-bold text-white bg-blue-800 p-2 inline-block" htmlFor="file-picker">Click Here</label>
                <input className="invisible size-0" type="file" id="file-picker" name="images" multiple accept="image/jpg, image/jpeg" onChange={handleFileChange} />
            </div>
            <button className="font-bold text-white bg-blue-800 p-2 inline-block rounded-sm" type="submit">Save</button>
        </form>
    )
}