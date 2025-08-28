//import Image from "next/image";
import {ListCollections} from "@/app/image_groups/list_collections";
import AddGroup from "@/app/image_groups/add_group";
import { Suspense } from "react";
import Loading from "@/app/components/loading";

export default async function Home() {
  const get_image_groups = () : Promise<ImageGroup[]> =>{
    return fetch(`${process.env.IMAGE_API_URL}/image_groups`)
      .then((res) => res.json())
      .catch((err) => {
        console.error("Error fetching image groups:", err);
      });
  }

  const imageGroups = get_image_groups();

  //const imageGroups = await data.json();
  //console.log(imageGroups);
  return (
    <div className="">
      <h1>Image Groups</h1>
      <AddGroup />

      <Suspense fallback={<Loading />}>
        <ListCollections groups={imageGroups} />
      </Suspense>
    </div>

  );
}
