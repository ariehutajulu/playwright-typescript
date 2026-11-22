import { test, expect } from '../../src/fixtures/baseFixture';

test.describe('Automated Accessibility (a11y) WCAG Audit @a11y', () => {
  test('A11Y01 - Login page conforms to WCAG 2.1 AA standards', async ({
    loginPage,
    makeAxeBuilder,
  }) => {
    await loginPage.open();

    const accessibilityScanResults = await makeAxeBuilder().analyze();

    // Filter for critical and serious violations
    const seriousViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(
      seriousViolations,
      `Detected critical or serious accessibility violations:\n${JSON.stringify(seriousViolations, null, 2)}`
    ).toEqual([]);
  });

  test('A11Y02 - Authenticated Inventory catalog has no critical accessibility blockers', async ({
    authedInventoryPage,
    makeAxeBuilder,
  }) => {
    const scanResults = await makeAxeBuilder().analyze();

    const criticalViolations = scanResults.violations.filter(
      (v) => v.impact === 'critical'
    );

    expect(
      criticalViolations,
      `Detected critical accessibility blockers on inventory page:\n${JSON.stringify(criticalViolations, null, 2)}`
    ).toEqual([]);
  });
});
