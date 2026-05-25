/** BE AuthRequest.AdminLoginRequest */
export interface AdminLoginRequest {
  username: string;
  password: string;
}

/** BE AuthResponse.AdminLoginResponse */
export interface AdminLoginResponse {
  accessToken: string;
  username: string;
}
