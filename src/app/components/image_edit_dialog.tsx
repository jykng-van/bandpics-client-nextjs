import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import UploadIcon from '@mui/icons-material/Upload';
import { GetAllGroups, RevalidateGroup } from "@/app/lib/group_actions";
import { UpdateImage } from "@/app/lib/image_actions";
import { useSession } from "next-auth/react";

export const ImageEditDialog = (
    {PictureData: pictureData, groupId, closeEdit }: {PictureData: PictureData, groupId: string, closeEdit: () => void}
) => {
    console.log('image edit', pictureData);
    const api_url = process.env.NEXT_PUBLIC_IMAGE_API_URL;
    const session = useSession();

    const urlPath = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
    const editDialog = useRef<HTMLDialogElement>(null);

    const [selectedGroup, setSelectedGroup] = useState<string>(groupId);
    const [imageGroups, setImageGroups] = useState<ImageGroup[]>([]);
    const [newImage, setNewImage] = useState<File | null>(null);

    const img_url = (filename: string): string => {
        return `${urlPath}/fullsize/${groupId}/${filename}`;
    }
    const [previewImage, setPreviewImage] = useState<string>(img_url(pictureData.filename));

    useEffect(() => {
        const initGroups = async () => {
            try {
                setImageGroups(await GetAllGroups());
            } catch (err) {
                console.error(err);
            }
        }
        initGroups();

    }, []);

    useEffect(() => {
        if (editDialog && editDialog.current) {
            if (pictureData !== null) {
                editDialog.current.showModal();
            }

        }
    }, [pictureData]);

    const handleReplaceFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('File change event');
        if (event.target.files && event.target.files.length > 0) {
            const files = event.target.files;
            console.log('Files', files);
            setNewImage(files[0]);
            setPreviewImage(URL.createObjectURL(files[0]));
        }
    }
    const handleReplaceDrop = (event: React.DragEvent<HTMLDivElement>) => {
        console.log('Drop event');
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files.length) {
            const files = event.dataTransfer.files;
            console.log('Dropped files', files);
            setNewImage(files[0]);
            setPreviewImage(URL.createObjectURL(files[0]));
        }
    }

    const handleSaveImage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const edit_data = new FormData(event.currentTarget);
        console.log(selectedGroup, groupId);
        if (selectedGroup === groupId) {
            edit_data.delete('group');
        }
        console.log(edit_data);
        UpdateImage(pictureData.id, edit_data).then((res_data) => {
            console.log('UpdateImage results', res_data);
            if (newImage != null) {
                const path = `${api_url}/images/${pictureData.id}/file`;
                console.log('Replacing image!', path);
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.data?.user?.accessToken}`
                };
                const body = JSON.stringify({ image: newImage.name });
                console.log(headers);
                console.log(body);
                fetch(path,
                    {
                        method: 'PATCH',
                        headers,
                        body
                    }
                ).then(async (res) => {
                    const res_data = await res.json();
                    console.log('Upload response:', res_data);

                    fetch(res_data.presigned_url, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': res_data.type
                        },
                        body: newImage, //file to upload
                    })
                        .then(async res => {
                            if (res.ok) {
                                console.log('image replaced')
                                setTimeout(() => {
                                    RevalidateGroup(); //revalidate group to show new images
                                    closeEdit(); //close the edit preview
                                }, 1500); // wait for resizing
                            } else {
                                console.error('Error uploading image:', { ...res, body: await res.json() });
                            }
                        })
                        .catch((err) => {
                            console.error('Error uploading image:', err);
                            return Promise.reject(err);
                        })
                }).catch((err) => {
                    console.error('Error getting presigned url', err);
                })
            } else {
                closeEdit(); //close the edit preview
            }
        }).catch((err) => {
            console.error("Image not saved", err);
        });


    }


    return (
        <dialog id="image-edit-dialog" ref={editDialog} className="relative bg-white p-4 rounded-md shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm fixed m-auto box-border">
            <form className="flex flex-col items-center" onSubmit={handleSaveImage}>
                <h4 className="font-bold text-lg">Editing Image</h4>
                <button className="btn absolute top-2 right-5 bg-sky-300 p-1 rounded-full inline-block" onClick={closeEdit} title="Close"><CloseIcon sx={{ color: 'white' }} /></button>

                <div className="flex-1 w-full" onDrop={handleReplaceDrop} onDragOver={(e) => e.preventDefault()}>
                    <Image src={previewImage} alt={pictureData.filename} width={800} height={600} className="object-contain" />
                </div>

                <section className="grid mt-4 grid-cols-2 grid-rows-2 w-full gap-3 p-3">
                    <div className="row-span-2 flex flex-col">
                        <label htmlFor="image-description" className="font-bold block">Description</label>
                        <textarea id="image-description" name="description" className="border border-gray-500 rounded-xs flex-1" defaultValue={pictureData.description}></textarea>
                    </div>
                    <div className="">
                        <label className="font-bold text-white bg-blue-800 p-2 inline-block" htmlFor="file-replacer"><UploadIcon /> Replace Image</label>
                        <input className="invisible size-0" type="file" id="file-replacer" multiple accept="image/jpg, image/jpeg" onChange={handleReplaceFile} />
                    </div>

                    <div>
                        <label htmlFor="image-group" className="font-bold block">Image Group</label>
                        <select id="image-group" name="group" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                            {imageGroups.map(g => (<option value={g.id} key={g.id}>{g.name}</option>))}
                        </select>
                    </div>
                </section>


                <div className="flex flex-row gap-4 justify-center">
                    <button className="font-bold text-white bg-gray-800 p-2 inline-block rounded-sm" type="button" onClick={closeEdit}>Cancel</button>
                    <button className="font-bold text-white bg-blue-800 p-2 inline-block rounded-sm" type="submit">Save</button>
                </div>

            </form>
        </dialog>
    )
}