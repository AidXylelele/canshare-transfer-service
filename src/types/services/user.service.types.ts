import { WixData } from "../models/wix.model.types";
import { CenshareData } from "../models/censhare.model.types";

export type Login = {
  email: string;
  password: string;
};

export type Registration = {
  email: string;
  password: string;
};

export type Identification = {
  _id: string;
  email: string;
};

export type InitialStep = {
  email: string;
  password: string;
};

export type FinalStep = Identification & {
  wix: WixData;
  censhare: CenshareData;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthRedirect = {
  redirect?: boolean;
  url?: string;
  accessToken: string;
};

export type Refresh = {
  refreshToken: string;
};

export type ChangePassword = {
  oldPassword: string;
  newPassword: string;
};
