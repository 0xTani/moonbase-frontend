import { IAuthentication, IUser } from './TUser';

export const DEFAULT_AUTHENTICATION: IAuthentication = {
  accessToken: null,
  payload: {
    aud: '',
    exp: 0,
    iat: 0,
    iss: '',
    jti: '',
    sub: '',
  },
};

export const DEFAULT_USER: IUser = {
  username: '',
  active: 0,
  alias: null,
  createdAt: '',
  credits: 0,
  ethaddress: null,
  fobId: null,
  id: 0,
  monthsActive: 0,
  password: '',
  pfp: '',
  updatedAt: '',
};
