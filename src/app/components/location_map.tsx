import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';

export const LocationMap = ({imageCoords}:{imageCoords:Coords})=>{
    const [coords, setCoords] = useState<GmapCoords |  null>(null);
    console.log('LocationMap', imageCoords);
    useEffect(()=>{
        setCoords({
            lat:imageCoords.latitude,
            lng:imageCoords.longitude
        })
    }, [imageCoords]);
    return(
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
            {coords &&
            <Map defaultZoom={18} defaultCenter={coords} style={{width:'25rem', height:'25rem'}} mapId={'venue-location'}>
                {/* <Marker position={coords}></Marker> */}
                <AdvancedMarker position={coords}>
                    <Pin background={'#932e1dff'} glyphColor={'#000'} borderColor={'#000'}></Pin>
                </AdvancedMarker>
            </Map>}
        </APIProvider>
    );
}