interface Coords {
    longitude: number,
    latitude: number
};
interface ExtraPictureData {
    DateTime: string;
    DateTimeOriginal?: string;
    OffsetTimeOriginal?: string;
    coords?: Coords
}
interface PictureData { // <-- Renamed from ImageData
    id: string;
    filename: string;
    description?: string;
    created_at: string;
    updated_at: string;
    data: ExtraPictureData;
}