interface LiveEvent{
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
    event_date?: string;
    location: LiveEventLocation;
    data: object;
    groups?: ImageGroup[];
}
interface LiveEventLocation{
    place_id:string;
    full_address:string;
    name:string;
    location:Coords;
}

interface Location{
    places: LocationPlace[];
    included_types: string[];
    locationRestriction: object;
    rank_preference:string;
    search_type:string;
}
interface LocationPlace{
    addressComponents:AddressComponent[];
    displayName:{text:string, languageCode:string};
    distance:number;
    formattedAddress:string;
    location:Coords;
    name:string;
    types:string[];
}
interface AddressComponent{
    longText:string;
    shortText:string;
    languageCode:string;
    types:string[];
}