import * as dotenv from 'dotenv';
dotenv.config();

export const DBCONNECTION = 'DBConnection';
export const LOG_REPO_TOKEN = 'LogRepositoryToken';
export const PROJECT_REPO_TOKEN = 'ProjectRepositoryToken';
export const INVOICE_REPO_TOKEN = 'InvoiceRepositoryToken';
export const DONTBEA_REPO_TOKEN = 'DontBeARepositoryToken';
export const USER_REPO_TOKEN = 'UserRepositoryToken';
export const TASK_REPO_TOKEN = 'TaskRepositoryToken';

export const JWT_KEY = process.env.JWT_KEY;

export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const DB_DATABASE = process.env.DB_DATABASE;
