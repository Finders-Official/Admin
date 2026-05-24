export interface AdminPhotoLabResponse {
  id: number;
  naverPlaceId: string | null;
  name: string;
  category: string | null;
  address: string | null;
  roadAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  phone: string | null;
}
