/** BE com.finders.api.domain.store.enums.PhotoLabStatus */
export type PhotoLabStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "CLOSED";

export const PHOTO_LAB_STATUS_LABEL: Record<PhotoLabStatus, string> = {
  PENDING: "대기",
  ACTIVE: "활성",
  SUSPENDED: "일시중지",
  CLOSED: "폐업",
};

/**
 * BE com.finders.api.domain.store.dto.response.AdminPhotoLabResponse
 *
 * `id` 는 TSID. BE 의 TsidSerializer 가 String 으로 직렬화한다.
 */
export interface AdminPhotoLab {
  id: string;
  name: string;
  category: string | null;
  address: string | null;
  phone: string | null;
  naverPlaceId: string | null;
  status: PhotoLabStatus;
  regionName: string | null;
}

/** BE AdminPhotoLabSeedResponse */
export interface SeedResult {
  inserted: number;
  updated: number;
  skipped: number;
  total: number;
}

/** BE AdminPhotoLabRequest.UpdateStatus */
export interface UpdatePhotoLabStatusRequest {
  status: PhotoLabStatus;
}
