/**
 * 신고 처리 상태 로컬 캐시 — localStorage 단일 키.
 *
 * BE 목록/상세 조회 API 가 process 처리 이후에도 상태를 "대기중"으로 반환하는 이슈가 있어,
 * 새로고침 시 관리자가 처리한 상태가 화면에서 초기화되는 것을 막기 위해
 * 처리 결과를 로컬에 저장해두고 조회 시 덮어쓴다.
 */

const STORAGE_KEY = "report_status_overrides";

type OverrideMap = Record<string, string>;

function key(type: string, targetId: string): string {
  return `${type}:${targetId}`;
}

function readAll(): OverrideMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export const reportStatusCache = {
  get(type: string, targetId: string): string | null {
    return readAll()[key(type, targetId)] ?? null;
  },

  set(type: string, targetId: string, status: string) {
    if (typeof window === "undefined") return;
    const all = readAll();
    all[key(type, targetId)] = status;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },

  /** BE 가 처리 상태를 정상 반영하기 시작하면 캐시를 비워 무한 누적을 막는다. */
  remove(type: string, targetId: string) {
    if (typeof window === "undefined") return;
    const all = readAll();
    const k = key(type, targetId);
    if (!(k in all)) return;
    delete all[k];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },
};
