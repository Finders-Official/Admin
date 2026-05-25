import axios from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api`;

/**
 * Admin axios 인스턴스.
 *
 * BE 는 server.servlet.context-path = /api 라 baseURL 에 `/api` 를 포함.
 * 인증은 interceptor 가 Bearer 토큰을 Authorization 헤더에 자동 첨부.
 */
export const http = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});
