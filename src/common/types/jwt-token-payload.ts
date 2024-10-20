export class AccountPayload {
  sub: number;
  is_admin: boolean;
}

export class JwtTokenPayload extends AccountPayload {
  is_refresh_token: boolean;
}
