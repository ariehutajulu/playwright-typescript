/**
 * Centralized API endpoints for REST testing suite
 */
export const ENDPOINTS = {
  USERS: '/users',
  USER_BY_ID: (id: number | string) => `/users/${id}`,
  LOGIN: '/login',
  REGISTER: '/register',
} as const;
