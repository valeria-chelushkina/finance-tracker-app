export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type ResetPasswordBody = {
  oldPassword: string;
  newPassword: string;
};
