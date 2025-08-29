import { Suspense } from "react";
import { Loading } from "@/app/components/loading";
import { GroupImages } from "./group_images";
import { GetImageGroup } from "@/app/lib/group_actions";
import Link from "next/link";

//use group ids for now
const EventPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  const promise_group = GetImageGroup(id);
  const image_group = await promise_group;
  console.log(image_group);
  //const session = useSession();

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <h2 className="font-bold text-lg">{image_group?.name}</h2>
        {image_group?.event && <Link href={`/events/${image_group.event}`}>&lt; Back to Group</Link>}
        {image_group?.description &&
          <p>{image_group.description}</p>
        }
        <GroupImages imageGroup={image_group} />

      </Suspense>

    </div>
  )
}
export default EventPage;