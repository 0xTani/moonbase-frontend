export interface IUser {
  id: number;
  username: string;
  ethaddress: string;
  fobId: string | null;
  alias: string | null;
  twitter: string;
  telegram: string;
  password: string;
  credits: number;
  active: number;
  badges: string;
  organizations: string;
  monthsActive: number;
  pfp: string | null;
  createdAt?: string;
  updatedAt?: string;
}
export type INewUser = Pick<IUser, 'username' | 'fobId' | 'alias' | 'password' | 'twitter' | 'telegram'>;

export interface INewUserForm extends INewUser {
  repeatpassword: string;
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
  authentication: IAuthentication;
}

export interface ITokenUri {
  name: string;
  description: string;
  image: string;
}

export interface IMembercardData {
  id: number | null;
  tokenUriUrl: string;
  tokenUriJson: ITokenUri | null;
}

export interface IBadge {
  id: number;
  name: string;
  definition: string;
  color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | undefined;
  maxUsers: number;
}
export interface IBadgeDisplay extends IBadge {
  isEquipped: boolean;
}
