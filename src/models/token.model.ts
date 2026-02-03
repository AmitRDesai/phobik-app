export interface JWTPayload {
  exp: number;
  iat: number;
  sub: string;
}

export interface UserToken {
  accessToken: string;
  refreshToken: string;
}
