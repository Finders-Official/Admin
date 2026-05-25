import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { tokenStorage } from "@/utils/tokenStorage";

export function useLogout() {
  const router = useRouter();
  const qc = useQueryClient();

  return useCallback(() => {
    tokenStorage.clear();
    qc.clear();
    router.replace("/login");
  }, [router, qc]);
}
