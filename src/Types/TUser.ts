export interface IUser {
  id: number;
  username: string;
  ethaddress: string | null;
  fobId: string | null;
  alias: string | null;
  password: string;
  credits: number;
  active: number;
  monthsActive: number;
  pfp: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuthentication {
  accessToken: string | null;
  payload: {
    aud: string;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    sub: string;
  };
}

export interface IAuthenticationResponse {
  user: IUser;
  authentication: {
    accessToken: string | undefined;
    payload: {
      aud: string;
      exp: number;
      iat: number;
      iss: string;
      jti: string;
      sub: string;
    };
  };
}
