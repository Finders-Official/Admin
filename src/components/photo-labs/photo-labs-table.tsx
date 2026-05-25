"use client";

import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { useUpdatePhotoLabStatus } from "@/hooks/photoLab/useUpdatePhotoLabStatus";
import { useIntersection } from "@/hooks/useIntersection";
import type { AdminPhotoLab, PhotoLabStatus } from "@/types/photoLab";

interface Props {
  labs: AdminPhotoLab[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  emptyHint?: string;
}

/**
 * 활성 토글 매핑.
 *   ACTIVE  → SUSPENDED  (운영자가 사용자 노출을 잠시 끌 때)
 *   그 외   → ACTIVE      (finders.it.kr 에 노출 시작)
 * 폐업/대기 처리는 별도 UI 가 필요해지면 그때.
 */
function nextStatus(current: PhotoLabStatus): PhotoLabStatus {
  return current === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
}

function toggleLabel(current: PhotoLabStatus): string {
  return current === "ACTIVE" ? "비활성화" : "활성화";
}

export function PhotoLabsTable({
  labs,
  isLoading,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  emptyHint,
}: Props) {
  const { mutate, isPending, variables } = useUpdatePhotoLabStatus({
    onSuccess: (lab) =>
      toast.success(`${lab.name} → ${lab.status === "ACTIVE" ? "활성" : "비활성"}`),
    onError: (e) => toast.error(`상태 변경 실패: ${e.message}`),
  });

  const sentinelRef = useIntersection<HTMLTableCellElement>(() => {
    onLoadMore?.();
  });

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>이름</TableHead>
            <TableHead>지역</TableHead>
            <TableHead>주소</TableHead>
            <TableHead>전화</TableHead>
            <TableHead>네이버 플레이스</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="w-28">변경</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                {isLoading ? "불러오는 중…" : (emptyHint ?? "데이터가 없습니다.")}
              </TableCell>
            </TableRow>
          ) : (
            <>
              {labs.map((lab) => {
                const togglingThis = isPending && variables?.id === lab.id;
                return (
                  <TableRow key={lab.id}>
                    <TableCell className="font-medium text-foreground">{lab.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {lab.regionName ?? "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {lab.address ?? "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{lab.phone ?? "-"}</TableCell>
                    <TableCell>
                      {lab.naverPlaceId ? (
                        <a
                          href={`https://map.naver.com/p/entry/place/${lab.naverPlaceId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                        >
                          보기 <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lab.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={togglingThis}
                        onClick={() => mutate({ id: lab.id, status: nextStatus(lab.status) })}
                      >
                        {togglingThis ? "처리 중" : toggleLabel(lab.status)}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {hasNextPage && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    ref={sentinelRef}
                    colSpan={7}
                    className="text-center text-muted-foreground py-6"
                  >
                    {isFetchingNextPage ? "더 불러오는 중…" : "스크롤하면 더 불러옵니다"}
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
