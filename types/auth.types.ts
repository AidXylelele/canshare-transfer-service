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
  upload: string;
  update: string;
  delete: string;
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
