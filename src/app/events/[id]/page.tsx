import { Suspense } from "react";
import Loading from "@/app/loading";
import EventImages from "./event_images";
import { GetImageGroup } from '@/app/lib/group_actions';

//use group ids for now
export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  /* const image_api = process.env.IMAGE_API_URL;

  async function getImages(groupId: string) : Promise<ImageGroup>{
    return fetch(`${image_api}/image_groups/${groupId}`)
      .then((res) => res.json())
      .catch((err) => {
        console.error('Error getting image group,', err);
      });
  }

  const promise_group = getImages(id); */
  const promise_group = GetImageGroup(id);
  const group = await promise_group;
  //const session = useSession();

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <h2 className="font-bold text-lg">{group?.name}</h2>
        {group?.description &&
          <p>{group.description}</p>
        }
        <EventImages imageGroup={group} />
      </Suspense>

    </div>
  )
}