"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSeedPhotoLabs } from "@/hooks/photoLab/useSeedPhotoLabs";

export function SeedButton() {
  const { mutate, isPending } = useSeedPhotoLabs({
    onSuccess: ({ inserted, updated, skipped, total }) =>
      toast.success(
        `시딩 완료: 신규 ${inserted}건 · 업데이트 ${updated}건 · 스킵 ${skipped}건 (총 ${total}건)`,
      ),
    onError: (e) => toast.error(`시딩 실패: ${e.message}`),
  });

  return (
    <Button onClick={() => mutate()} disabled={isPending}>
      {isPending ? "시딩 중…" : "카탈로그 시딩 실행"}
    </Button>
  );
}
