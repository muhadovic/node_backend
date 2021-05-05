export class Config {
  public static NUMBER_OF_PRICING_PLANS = 12;
  public static MINIMUM_BALANCE_TO_UNLOCK_SCOOTER = 10;
  public static LANGUAGES_COUNT = 3;
}

export const EMPLOYEE_ACCESS_TOKEN_CONST: {
  TTL: number;
  SIZE: number;
} = {
  TTL: 1000 * 60 * 60 * 8, // 8 hours
  SIZE: 200,
};

export const USER_ACCESS_TOKEN_CONST: {
  TTL: number;
  SIZE: number;
} = {
  TTL: 1000 * 60 * 60 * 720 * 6, // 6 month
  SIZE: 200,
};
