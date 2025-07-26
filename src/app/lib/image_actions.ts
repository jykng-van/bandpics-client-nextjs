'use server'
import { revalidateTag } from "next/cache";

const api_url = process.env.IMAGE_API_URL;

export async function DeleteImage(image_id: string) {
    // Update data
    await fetch(`${api_url}/images/${image_id}`,{
        method: 'DELETE'
    });
    revalidateTag('image');

    // Revalidate cache
}