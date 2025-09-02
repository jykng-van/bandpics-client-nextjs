import { useContext, useState, useEffect } from "react"
import { ImageGroupsContext } from "@/app/events/event_form";
import { useMap, Map as GMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { GetLocations } from "@/app/lib/event_actions";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Image from "next/image";


export const LocationPicker = ()=>{
    const imageGroups = useContext(ImageGroupsContext);

    const [foundCoords, setFoundCoords] = useState<{images:string[], coords:GmapCoords}[]>([]);
    const [locationResult, setLocationResult] = useState<Location | null>(null);
    const [selectedPoint, setSelectedPoint] = useState<number>(0);
    const [showingPics, setShowingPics] = useState<boolean>(false);

    const [startingCenter, setStartingCenter] = useState<GmapCoords | null>(null);

    const cloudfront = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

    const map = useMap();
    useEffect(() => {
        if (!map) return;

        // do something with the map instance
    }, [map]);

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
                    coord_data.images.push(`[SIZE]/${group.id}/${img.filename}`);
                    if (!coords.has(key)){
                        coords.set(key, coord_data);
                    }
                }
            });
        });

        const sorted_coords = getSortedCoords(coords)
        setFoundCoords(sorted_coords);
        console.log('sorted_coords', sorted_coords);
        findLocations(sorted_coords[0].coords);
        setStartingCenter(sorted_coords[0].coords);
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
        }).map(([coord, found])=> {
            const [lng, lat] = JSON.parse(coord);
            return {
                coords:{lng,lat},
                images:found.images
            }
        });
    }

    const findLocations = async(coords:GmapCoords, searchType:number = 1, radius:number = 50.0)=>{
        const locations_results = await GetLocations(coords, searchType, radius);
        console.log('findLocations', locations_results);
        setLocationResult(locations_results);
    }
    const changeSelected = (inc:number)=>{
        //Make only -1 or 1
        inc = inc < 0? -1:1;
        let index:number = selectedPoint;
        if (inc == -1 && selectedPoint==0){
            index = foundCoords.length-1; //wrap around 0
        }else if (inc == 1 && selectedPoint==foundCoords.length-1){
            index = 0; //wrap around end of array
        }else{
            index += inc; //standard
        }
        setSelectedPoint(index);
        map?.panTo(foundCoords[index].coords);
    }


    return(
        <>
            <div>{foundCoords.length} possible coordinates found</div>
            <section className="grid grid-cols-[1fr_20rem] grid-rows-[auto_1fr] size-full">
                <div className="row-span-full">
                {foundCoords.length &&
                <GMap defaultZoom={18} defaultCenter={foundCoords[0].coords} style={{width:'100%', height:'100%'}} mapId={'venue-location'}>
                    {foundCoords.map((point, index)=>(
                        <AdvancedMarker key={`maker${index}`} position={point.coords} zIndex={index==selectedPoint ? 2:1}
                        clickable={true} onClick={()=>setSelectedPoint(index)}>
                            <Pin background={index==selectedPoint ? '#932e1dff':'#a5a1a1ff'} glyphColor={'#000'} borderColor={'#000'}></Pin>
                        </AdvancedMarker>
                    ))}
                </GMap>}
                </div>
                <div>
                    <div id="points-control" className="flex flex-row items-center justify-stretch h-[3rem]">
                        <button onClick={()=>changeSelected(-1)}><ArrowLeftIcon /></button>
                        <div className="flex-1 text-center">
                            Coordinate {selectedPoint + 1} <br />
                            {foundCoords && foundCoords[selectedPoint] &&
                            <button onClick={()=>{setShowingPics(!showingPics)}}>{foundCoords[selectedPoint].images.length} Images</button>}
                        </div>
                        <button onClick={()=>changeSelected(1)}><ArrowRightIcon /></button>
                    </div>
                    <div id="points-pictures">
                        {showingPics && <ul className="flex flex-row flex-wrap">
                            {foundCoords[selectedPoint].images.map((img, num)=><li key={`img${num}`}>
                                <a onClick={()=>{}}><Image
                                    className="w-[10rem]"
                                    src={`${cloudfront}/${img.replace('[SIZE]','thumb')}`}
                                    alt={`img${num}`}
                                    width={50}
                                    height={50}
                                /></a>
                            </li>)}
                        </ul>}
                    </div>
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
        </>

    );
}