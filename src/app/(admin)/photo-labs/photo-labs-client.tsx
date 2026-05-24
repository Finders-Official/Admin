"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { seedPhotoLabsAction, updatePhotoLabStatusAction } from "./actions";
import type { AdminPhotoLabResponse } from "./page";

interface Props {
  labs: AdminPhotoLabResponse[];
  totalPages: number;
  currentPage: number;
}

export function PhotoLabsClient({ labs: initialLabs, totalPages, currentPage }: Props) {
  const [labs, setLabs] = useState(initialLabs);
  const [seedPending, startSeed] = useTransition();
  const [togglingId, setTogglingId] = useState<number | null>(null);

  function handleSeed() {
    startSeed(async () => {
      const result = await seedPhotoLabsAction();
      if (result.error) {
        toast.error(`시딩 실패: ${result.error}`);
      } else if (result.data) {
        const { inserted, updated, skipped, total } = result.data;
        toast.success(`시딩 완료: 신규 ${inserted}건 / 업데이트 ${updated}건 / 스킵 ${skipped}건 (총 ${total}건)`);
      }
    });
  }

  async function handleToggleStatus(lab: AdminPhotoLabResponse) {
    const next = lab.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setTogglingId(lab.id);
    const result = await updatePhotoLabStatusAction(lab.id, next);
    setTogglingId(null);
    if (result.error) {
      toast.error(`상태 변경 실패: ${result.error}`);
    } else {
      setLabs((prev) =>
        prev.map((l) => (l.id === lab.id ? { ...l, status: next } : l))
      );
      toast.success(`${lab.name} → ${next === "ACTIVE" ? "활성" : "비활성"}`);
    }
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">사진관 카탈로그</h1>
        <Button onClick={handleSeed} disabled={seedPending}>
          {seedPending ? "시딩 중..." : "카탈로그 시딩 실행"}
        </Button>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>주소</TableHead>
              <TableHead>네이버 플레이스</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="w-28">변경</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                  데이터가 없습니다. 시딩을 실행해주세요.
                </TableCell>
              </TableRow>
            ) : (
              labs.map((lab) => (
                <TableRow key={lab.id}>
                  <TableCell className="font-medium">{lab.name}</TableCell>
                  <TableCell className="text-slate-600">{lab.category ?? "-"}</TableCell>
                  <TableCell className="text-slate-600 max-w-xs truncate">
                    {lab.roadAddress ?? lab.address ?? "-"}
                  </TableCell>
                  <TableCell>
                    {lab.naverPlaceId ? (
                      <a
                        href={`https://map.naver.com/p/entry/place/${lab.naverPlaceId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                      >
                        보기 <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lab.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={togglingId === lab.id}
                      onClick={() => handleToggleStatus(lab)}
                    >
                      {togglingId === lab.id
                        ? "처리 중"
                        : lab.status === "ACTIVE"
                        ? "비활성화"
                        : "활성화"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "ACTIVE") {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">활성</Badge>;
  }
  if (status === "INACTIVE") {
    return <Badge variant="secondary">비활성</Badge>;
  }
  return <Badge variant="outline">{status}</Badge>;
}

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {currentPage > 0 && (
        <a
          href={`?page=${currentPage - 1}`}
          className="px-3 py-1.5 rounded border text-sm hover:bg-slate-50"
        >
          이전
        </a>
      )}
      <span className="text-sm text-slate-600">
        {currentPage + 1} / {totalPages}
      </span>
      {currentPage + 1 < totalPages && (
        <a
          href={`?page=${currentPage + 1}`}
          className="px-3 py-1.5 rounded border text-sm hover:bg-slate-50"
        >
          다음
        </a>
      )}
    </div>
  );
}
