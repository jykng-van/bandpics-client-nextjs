import { useContext, useState, useEffect } from "react"
import { ImageGroupsContext } from "@/app/events/event_form";
import { APIProvider, Map as GMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { GetLocations } from "@/app/lib/event_actions";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


export const LocationPicker = ()=>{
    const imageGroups = useContext(ImageGroupsContext);

    const [foundCoords, setFoundCoords] = useState<GmapCoords[]>([]);
    const [groupedCoords, setGroupedCoords] = useState<Map<string, {images:string[]}>>(new Map());
    const [locationResult, setLocationResult] = useState<Location | null>(null);
    const [selectedPoint, setSelectedPoint] = useState<number>(0);

    console.log('LocationMap', foundCoords);
    console.log(foundCoords[0]);



    useEffect(() => {
        const DECIMALS = 4; //the coordinate accuracy we want, 4 decimals places is roughly 11.1 metres
        const factor = Math.pow(10, DECIMALS);
        const roundCoord = (num:number)=> Math.round(num * factor) / factor;

        const coords = new Map<string, {images:string[]}>();

        //get all coordinates from all images in each group
        imageGroups.forEach(group=>{ //each group
            group.images?.forEach(img=>{
                if (img.data.coords){
                    const lat = roundCoord(img.data.coords.latitude);
                    const lng = roundCoord(img.data.coords.longitude);
                    const key = JSON.stringify([lng,lat]);
                    console.log(img.filename, key, coords.get(key) || 0);
                    //coords.set(key, (coords.get(key) || 0) + 1 );

                    // Add or update the entry in the new Map
                    const coord_data = coords.get(key) || {images:[]};
                    coord_data.images.push(`${group.name}/[SIZE]/${img.filename}`);
                    if (!coords.has(key)){
                        coords.set(key, coord_data);
                    }
                }
            });
        });
        setGroupedCoords(coords);
        const sorted_coords = getSortedCoords(coords)
        setFoundCoords(sorted_coords);
        console.log('sorted_coords', sorted_coords);
        console.log('grouped_coords', coords);
        findLocations(sorted_coords[0]);
    }, [imageGroups]);

    const getSortedCoords = (coords:Map<string, {images:string[]}>)=>{
        return Array.from(coords).sort(([_coord1, data1],[_coord2, data2])=>{
            if (data1.images.length < data2.images.length){
                return 1;
            }else if (data1.images.length > data2.images.length){
                return -1;
            }else{
                return 0;
            }
        }).map(([coord, _found])=> {
            const [lng, lat] = JSON.parse(coord);
            return {
                lng,
                lat
            }
        });
    }

    const findLocations = async(coords:GmapCoords, searchType:number = 1, radius:number = 50.0)=>{
        const locations_results = await GetLocations(coords, searchType, radius);
        console.log('findLocations', locations_results);
        setLocationResult(locations_results);
    }

    return(
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
            <div>{foundCoords.length} possible coordinates found</div>
            <section className="grid grid-cols-[1fr_20rem] grid-rows-[4rem_1fr] w-[95vw] h-[90vh]">
                <div className="row-span-full">
                {foundCoords &&
                <GMap defaultZoom={18} defaultCenter={foundCoords[0]} style={{width:'100%', height:'100%'}} mapId={'venue-location'}>
                    {foundCoords.map((coord, index)=>(
                        <AdvancedMarker key={`maker${index}`} position={coord} zIndex={index==selectedPoint ? 2:1}
                        clickable={true} onClick={()=>setSelectedPoint(index)}>
                            <Pin background={index==selectedPoint ? '#147631ff':'#a5a1a1ff'} glyphColor={'#000'} borderColor={'#000'}></Pin>
                        </AdvancedMarker>
                    ))}
                </GMap>}
                </div>
                <div className="flex flex-row items-center justify-stretch">
                    <button><ArrowLeftIcon /></button>
                    <div className="flex-1 text-center">
                        Coordinate {selectedPoint + 1} <br />
                        <em></em>
                    </div>
                    <button><ArrowRightIcon /></button>
                </div>
                <div>
                    <h3>Places Found</h3>
                    {locationResult && locationResult.places &&
                    <ul>
                        {locationResult.places.map((loc:LocationPlace)=>(
                            <li key={loc.name}>
                                <h4 className="font-bold">{loc.displayName.text}</h4>
                                <div>{loc.formattedAddress}</div>
                                <div className="italic">{`${loc.distance.toFixed(1)}m`}</div>
                            </li>
                        ))}
                    </ul>}
                </div>

            </section>

        </APIProvider>
    );
}