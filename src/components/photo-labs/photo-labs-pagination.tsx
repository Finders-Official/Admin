"use client";

import { Button } from "@/components/ui/button";

interface Props {
  /** 0-based */
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  isFetching?: boolean;
}

export function PhotoLabsPagination({ currentPage, totalPages, onChange, isFetching }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 0 || isFetching}
        onClick={() => onChange(currentPage - 1)}
      >
        이전
      </Button>
      <span className="text-sm text-muted-foreground tabular-nums">
        {currentPage + 1} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage + 1 >= totalPages || isFetching}
        onClick={() => onChange(currentPage + 1)}
      >
        다음
      </Button>
    </div>
  );
}
