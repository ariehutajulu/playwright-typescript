import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const envConfig = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  users: {
    standard: process.env.STANDARD_USER || 'standard_user',
    locked: process.env.LOCKED_USER || 'locked_out_user',
    problem: process.env.PROBLEM_USER || 'problem_user',
    password: process.env.STANDARD_PASSWORD || 'secret_sauce',
  },
  isHeadless: process.env.HEADLESS !== 'false',
  timeout: Number(process.env.DEFAULT_TIMEOUT) || 30000,
};
