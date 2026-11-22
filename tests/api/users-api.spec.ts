import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/ApiClient';
import { TestDataGenerator } from '../../src/utils/testDataGenerator';

test.describe('REST API Test Suite @api', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('API01 - GET /users returns list with valid schema', async () => {
    const response = await apiClient.getUsers();
    expect(response.status()).toBe(200);

    const body = await response.json();
    // Accommodate both flat arrays (JSONPlaceholder) and paginated data arrays (ReqRes)
    const users = Array.isArray(body) ? body : body.data;
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);

    const firstUser = users[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('email');
  });

  test('API02 - GET /users/:id retrieves a specific user resource', async () => {
    const targetId = 2;
    const response = await apiClient.getUserById(targetId);
    expect(response.status()).toBe(200);

    const body = await response.json();
    // Accommodate both direct object (JSONPlaceholder) and wrapped data object (ReqRes)
    const user = body.data ? body.data : body;
    expect(user.id).toBe(targetId);
    expect(user.email).toContain('@');
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
    expect(body).toHaveProperty('id');
  });

  test('API05 - PUT /users/:id updates an existing user', async () => {
    const updatedData = { name: 'Jane QA Lead', job: 'Principal SDET' };
    const response = await apiClient.updateUser(2, updatedData);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.name).toBe(updatedData.name);
  });

  test('API06 - DELETE /users/:id removes user with success status', async () => {
    const response = await apiClient.deleteUser(2);
    // Standard REST permits 200 (JSONPlaceholder) or 204 No Content (ReqRes)
    expect([200, 204]).toContain(response.status());
  });
});
