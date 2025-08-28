import { Suspense } from "react";
import Loading from "@/app/components/loading";
import EventImages from "../event_images";
import { GetLiveEvent } from "@/app/lib/event_actions";
import { GetEventGroups } from "@/app/lib/group_actions";
import AddGroup from "@/app/image_groups/add_group";
import EventForm from "../event_form";
import moment from "moment";


//use group ids for now
export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const promise_event = GetLiveEvent(id);
  const live_event = await promise_event;
  console.log(live_event);

  const promise_groups = GetEventGroups(id);
  const event_groups = await promise_groups;
  console.log(event_groups);

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <h1 className="font-bold text-2xl">{live_event?.name}</h1>
        {live_event?.event_date && <time className="italic" dateTime={live_event.event_date}>{moment(live_event.event_date, 'YYYY-MM-DD').format('MMMM D, YYYY')}</time>}
        {live_event?.description &&
          <p>{live_event.description}</p>
        }
        <EventImages groups={event_groups} />

        <AddGroup eventId={id} />

        <EventForm liveEvent={live_event} />
      </Suspense>

    </div>
  )
}