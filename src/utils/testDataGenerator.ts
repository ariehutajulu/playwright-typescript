import { faker } from '@faker-js/faker';

export interface CustomerData {
  firstName: string;
  lastName: string;
  postalCode: string;
  email: string;
}

export interface UserPayload {
  name: string;
  job: string;
}

export class TestDataGenerator {
  /**
   * Generates realistic checkout information
   */
  static generateCustomer(): CustomerData {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode('#####'),
      email: faker.internet.email(),
    };
  }

  /**
   * Generates a sample payload for API creation
   */
  static generateUserPayload(): UserPayload {
    return {
      name: faker.person.fullName(),
      job: faker.person.jobTitle(),
    };
  }
}
