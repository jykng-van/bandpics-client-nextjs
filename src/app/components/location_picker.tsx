import { useContext, useState, useEffect } from "react"
import { ImageGroupsContext } from "@/app/events/event_form";
import { APIProvider, Map as GMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { GetLocations } from "@/app/lib/event_actions";


export const LocationPicker = ()=>{
    const imageGroups = useContext(ImageGroupsContext);

    const [foundCoords, setFoundCoords] = useState<GmapCoords[]>([]);
    const [locationResult, setLocationResult] = useState<Location | null>(null);
    const [selectedPoint, setSelectedPoint] = useState<number>(0);

    console.log('LocationMap', foundCoords);
    console.log(foundCoords[0]);



    useEffect(() => {
        const DECIMALS = 4; //the coordinate accuracy we want, 4 decimals places is roughly 11.1 metres
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
        const sorted_coords = getSortedCoords(coords)
        setFoundCoords(sorted_coords);
        console.log('sorted_coords', sorted_coords);
        findLocations(sorted_coords[0]);
    }, [imageGroups]);

    const getSortedCoords = (coords:Map<string, number>)=>{
        return Array.from(coords).sort(([_coord1, found1],[_coord2, found2])=>{
            if (found1 < found2){
                return 1;
            }else if (found1 > found2){
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
            <section className="grid grid-cols-[1fr_15rem] w-[95vw] h-[90vh]">
                <div>
                {foundCoords &&
                <GMap defaultZoom={18} defaultCenter={foundCoords[0]} style={{width:'100%', height:'100%'}} mapId={'venue-location'}>
                    {foundCoords.map((coord, index)=>(
                        <AdvancedMarker key={`maker${index}`} position={coord} clickable={true} onClick={()=>setSelectedPoint(index)}>
                            <Pin background={index==selectedPoint ? '#147631ff':'#a5a1a1ff'} glyphColor={'#000'} borderColor={'#000'}></Pin>
                        </AdvancedMarker>
                    ))}
                </GMap>}
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