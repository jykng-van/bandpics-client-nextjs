interface ImageGroup{
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
    images?: ImageData[];
    event?: string;
}