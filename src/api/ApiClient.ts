import { APIRequestContext, APIResponse } from '@playwright/test';
import { ENDPOINTS } from './Endpoints';
import { envConfig } from '../utils/envConfig';

export interface UserResponse {
  id?: number | string;
  name?: string;
  job?: string;
  createdAt?: string;
  updatedAt?: string;
  data?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
}

export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = envConfig.apiBaseUrl) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch paginated list of users
   */
  async getUsers(page: number = 1): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}${ENDPOINTS.USERS}?page=${page}`);
  }

  /**
   * Fetch a single user by ID
   */
  async getUserById(id: number | string): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}${ENDPOINTS.USER_BY_ID(id)}`);
  }

  /**
   * Create a new user resource
   */
  async createUser(payload: { name: string; job: string }): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}${ENDPOINTS.USERS}`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Update an existing user resource via PUT
   */
  async updateUser(id: number | string, payload: { name: string; job: string }): Promise<APIResponse> {
    return await this.request.put(`${this.baseUrl}${ENDPOINTS.USER_BY_ID(id)}`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Delete a user by ID
   */
  async deleteUser(id: number | string): Promise<APIResponse> {
    return await this.request.delete(`${this.baseUrl}${ENDPOINTS.USER_BY_ID(id)}`);
  }
}
