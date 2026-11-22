import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/ApiClient';
import { TestDataGenerator } from '../../src/utils/testDataGenerator';

test.describe('REST API Test Suite (ReqRes) @api', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('API01 - GET /users returns paginated list with valid schema', async () => {
    const response = await apiClient.getUsers(1);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.page).toBe(1);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    const firstUser = body.data[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('first_name');
    expect(firstUser).toHaveProperty('last_name');
    expect(firstUser).toHaveProperty('avatar');
  });

  test('API02 - GET /users/:id retrieves a specific user resource', async () => {
    const targetId = 2;
    const response = await apiClient.getUserById(targetId);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data.id).toBe(targetId);
    expect(body.data.email).toContain('@');
  });

  test('API03 - GET /users/:id returns 404 for non-existent resource', async () => {
    const nonExistentId = 99999;
    const response = await apiClient.getUserById(nonExistentId);
    expect(response.status()).toBe(404);
  });

  test('API04 - POST /users successfully creates a new user', async () => {
    const userPayload = TestDataGenerator.generateUserPayload();
    const response = await apiClient.createUser(userPayload);
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe(userPayload.name);
    expect(body.job).toBe(userPayload.job);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');
  });

  test('API05 - PUT /users/:id updates an existing user', async () => {
    const updatedData = { name: 'Jane QA Lead', job: 'Principal SDET' };
    const response = await apiClient.updateUser(2, updatedData);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.name).toBe(updatedData.name);
    expect(body.job).toBe(updatedData.job);
    expect(body).toHaveProperty('updatedAt');
  });

  test('API06 - DELETE /users/:id removes user with 204 No Content', async () => {
    const response = await apiClient.deleteUser(2);
    expect(response.status()).toBe(204);
  });
});
