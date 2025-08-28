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