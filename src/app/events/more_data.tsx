import { useContext, useEffect, useRef, useState } from "react"
import { LiveEventContext, ImageGroupsContext } from "./event_form";
import CloseIcon from '@mui/icons-material/Close';

export const MoreData = (
    {closeCallback}
    :
    {closeCallback:()=>void})=>
{
    const liveEvent = useContext(LiveEventContext);
    const imageGroups = useContext(ImageGroupsContext);

    const moreDialog = useRef<HTMLDialogElement>(null);

    const [coordList, setCoordList] = useState<Map<string, number>>(new Map());



    console.log('more_data liveEvent', liveEvent);



    useEffect(() => {
        if (moreDialog && moreDialog.current) { //open dialog
            if (liveEvent !== null) {
                moreDialog.current.showModal();
            }
        }
    }, [liveEvent]);

    useEffect(() => {
        const DECIMALS = 4; //the coordinate accuracy we want
        const factor = Math.pow(10, DECIMALS);
        const roundCoord = (num:number)=> Math.round(num * factor) / factor;

        const coords = new Map<string, number>();

        //get all coordinates from all images in each group
        imageGroups.forEach(group=>{ //each group
            group.images?.forEach(img=>{
                if (img.data.coords){
                    const lat = roundCoord(img.data.coords.latitude);
                    const lng = roundCoord(img.data.coords.longitude);
                    const key = JSON.stringify([lng,lat]);
                    console.log(img.filename, key, coords.get(key) || 0);
                    coords.set(key, (coords.get(key) || 0) + 1 ); // Add or update the entry in the new Map
                }
            });
        });
        setCoordList(coords);
    }, [imageGroups]);

    if (liveEvent)
    return (
        <dialog id="event-more-data" ref={moreDialog}
        className="bg-white p-4 rounded-md shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm fixed m-auto box-border">
            <button className="btn absolute top-2 right-5 bg-sky-300 p-1 rounded-full inline-block" onClick={closeCallback} title="Close"><CloseIcon sx={{ color: 'white' }} /></button>

            <h2 className="text-2xl font-bold">Additional Data</h2>
            <div>For {liveEvent.name}</div>
            <div>{coordList.size} pictures with GPS coordinates found</div>
            {Array.from(coordList).map(([key,val])=>(
                <div key={key}>{key}:{val}</div>
            ))}
        </dialog>
    )
}