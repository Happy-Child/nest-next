export enum USERS_SEXES {
  MALE = 'male',
  FEMALE = 'female',
}

export const COOKIE = {
  ACCESS_TOKEN: 'Authorization',
};

export const MAX_NAME_LENGTH = 40;

export const MAX_PASSWORD_LENGTH = 60;

export const MIN_PASSWORD_LENGTH = 8;

export const PASSWORD_SALT_ROUNDS = 10;

export const ACCESS_TOKEN_EXPIRES_SECS = 30 * 24 * 60 * 60; // 30 days
