import { useContext, useEffect, useRef, useState } from "react"
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
    enum DataStep {
        location,
        concert
    };
    const [step, setStep] = useState<DataStep>(DataStep.location);

    console.log('more_data liveEvent', liveEvent);

    useEffect(() => {
        if (moreDialog && moreDialog.current) { //open dialog
            if (liveEvent !== null) {
                moreDialog.current.showModal();
            }
        }
    }, [liveEvent]);

    const moreDataOptions = ()=>{
        const steps = [
            {step:DataStep.location, name:'Location/Venue'},
            {step:DataStep.concert, name:'Concert Event'}
        ];
        return steps.map(s=>(<a onClick={()=>{setStep(s.step)}} className={
            "inline-block pr-5 pl-[1rem] relative h-[1.5rem]"+
            " after:absolute after:right-[-1.5rem] after:border-transparent after:border-[.75rem] after:z-1"
            + (step==s.step ? ' bg-blue-100 after:border-l-blue-100': ' bg-gray-200 after:border-l-gray-200')}>{s.name}</a>))
    }
    const nextStepCallback = ()=>{
        if (step < Object.keys(DataStep).length-1){
            setStep(step+1);
        }else{
            closeCallback();
        }
    }

    if (liveEvent)
    return (
        <dialog id="event-more-data" ref={moreDialog}
        className="bg-white p-4 rounded-md shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm fixed m-auto box-border h-[95vh] w-[95vw] box-border">
            <button className="btn absolute top-2 right-5 bg-sky-300 p-1 rounded-full inline-block" onClick={closeCallback} title="Close"><CloseIcon sx={{ color: 'white' }} /></button>
            <section className="flex flex-col h-full">
                <header className="border-b">
                    <h2 className="text-2xl font-bold">Additional Data</h2>
                    <div>{liveEvent.name}</div>
                </header>
                <nav className="border-b flex flex-row items-center">
                    {moreDataOptions()}
                </nav>
                <div className="flex-1">
                    {step==DataStep.location && <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                        <LocationPicker saveCallback={nextStepCallback}></LocationPicker>
                    </APIProvider>}
                    {step==DataStep.concert && <div>Concert stuff</div>}
                </div>

            </section>
        </dialog>
    )
}