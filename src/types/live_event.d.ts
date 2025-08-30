interface LiveEvent{
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
    event_date?: string;
    location: object;
    data: object;
    groups?: ImageGroup[];
}

interface Location{
    places: LocationPlace[];
    included_types: string[];
    locationRestriction: object;
    rank_preference:string;
    search_type:string;
}
interface LocationPlace{
    addressComponents:object[];
    displayName:{text:string, languageCode:string};
    distance:number;
    formattedAddress:string;
    location:{latitude:number, longitude:number};
    name:string;
    types:string[];
}