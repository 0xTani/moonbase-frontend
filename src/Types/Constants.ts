import { IAuthentication, INewUser, INewUserForm, IUser } from './TUser';

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
  twitter: '',
  telegram: '',
  createdAt: '',
  credits: 0,
  ethaddress: '',
  fobId: null,
  id: 0,
  badges: '[]',
  organizations: '[]',
  monthsActive: 0,
  password: '',
  pfp: '',
  updatedAt: '',
};

export const DEFAULT_NEW_USER_FORM: INewUserForm = {
  username: '',
  alias: '',
  twitter: '',
  telegram: '',
  fobId: '',
  password: '',
  repeatpassword: '',
};
