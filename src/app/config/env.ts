import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  JWT_SECRET: string;
  ACCESS_TOKEN_EXPIRE: string;
  GEMINI_API_KEY: string;
  NODE_ENV: "development" | "production";
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables = [
    "PORT",
    "DB_URL",
    "JWT_SECRET",
    "ACCESS_TOKEN_EXPIRE",
    "GEMINI_API_KEY",
    "NODE_ENV",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE as string,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

export const envVars = loadEnvVariables();
