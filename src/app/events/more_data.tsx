import { useContext, useEffect, useRef } from "react"
import { LiveEventContext } from "./event_form";
import CloseIcon from '@mui/icons-material/Close';
import { LocationPicker } from "../components/location_picker";
import { APIProvider } from '@vis.gl/react-google-maps';

export const MoreData = (
    {closeCallback}
    :
    {closeCallback:()=>void})=>
{
    const liveEvent = useContext(LiveEventContext);
    //const imageGroups = useContext(ImageGroupsContext);

    const moreDialog = useRef<HTMLDialogElement>(null);

    //const [coordList, setCoordList] = useState<GmapCoords[]>([]);

    console.log('more_data liveEvent', liveEvent);

    useEffect(() => {
        if (moreDialog && moreDialog.current) { //open dialog
            if (liveEvent !== null) {
                moreDialog.current.showModal();
            }
        }
    }, [liveEvent]);

    if (liveEvent)
    return (
        <dialog id="event-more-data" ref={moreDialog}
        className="bg-white p-4 rounded-md shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm fixed m-auto box-border h-[95vh] w-[95vw] box-border">
            <button className="btn absolute top-2 right-5 bg-sky-300 p-1 rounded-full inline-block" onClick={closeCallback} title="Close"><CloseIcon sx={{ color: 'white' }} /></button>

            <h2 className="text-2xl font-bold">Additional Data</h2>
            <div>For {liveEvent.name}</div>

            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                <LocationPicker></LocationPicker>
            </APIProvider>

        </dialog>
    )
}