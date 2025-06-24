//import Image from "next/image";
import ListCollections from "./list_collections";
import { Suspense } from "react";
import Loading from "./loading";

function get_image_groups() : Promise<ImageGroup[]>{
  return fetch(`${process.env.IMAGE_API_URL}/image_groups`)
    .then((res) => res.json())
    .catch((err) => {
      console.error("Error fetching image groups:", err);
    });
}

export default async function Home() {
  const imageGroups = get_image_groups();
  //const imageGroups = await data.json();
  console.log(imageGroups);
  return (
    <div className="">
      <Suspense fallback={<Loading />}>
        <ListCollections groups={imageGroups} />
      </Suspense>
    </div>

  );
}
