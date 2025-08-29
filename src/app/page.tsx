//import Image from "next/image";
import { ListCollections } from "@/app/events/list_collections";
import { AddEvent } from "@/app/events/add_event";
import { Suspense } from "react";
import { Loading } from "./components/loading";
import Link from "next/link";

const Home = async ()=>{
  const get_live_events = () : Promise<LiveEvent[]> =>{
    return fetch(`${process.env.EVENT_API_URL}/events`)
      .then((res) => res.json())
      .catch((err) => {
        console.error("Error fetching image groups:", err);
      });
  }

  const liveEvents = get_live_events();

  //const imageGroups = await data.json();
  //console.log(imageGroups);
  return (
    <div className="">

      <Link href="/image_groups">Go to Image Groups</Link>

      <h1 className="text-xl">Live Events</h1>
      <AddEvent />

      <Suspense fallback={<Loading />}>
        <ListCollections events={liveEvents} />
      </Suspense>
    </div>

  );
}
export default Home;