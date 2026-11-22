import { test, expect } from '../../src/fixtures/baseFixture';

test.describe('Playwright Demo TodoMVC - Button Verifications @buttons @todomvc', () => {
  const TODO_ITEMS = [
    'Learn Playwright Locators',
    'Verify Button States & Interactivity',
    'Write Clean Page Objects',
  ];

  test.beforeEach(async ({ todoPage }) => {
    await todoPage.open();
    await todoPage.createTodos(...TODO_ITEMS);
  });

  test('BTN01 - Verify "Toggle All" button marks and unmarks all items', async ({
    todoPage,
  }) => {
    await test.step('Initial state: items are active and toggle-all is not checked', async () => {
      await expect(todoPage.toggleAllCheckbox).not.toBeChecked();
      await expect(todoPage.itemsLeftCount).toHaveText('3 items left');
    });

    await test.step('Click "Toggle All" button to complete all tasks', async () => {
      await todoPage.clickToggleAll();
      await expect(todoPage.toggleAllCheckbox).toBeChecked();
      // All items should have class "completed"
      await expect(todoPage.todoItems).toHaveClass(['completed', 'completed', 'completed']);
      await expect(todoPage.itemsLeftCount).toHaveText('0 items left');
    });

    await test.step('Click "Toggle All" button again to reactivate all tasks', async () => {
      await todoPage.clickToggleAll();
      await expect(todoPage.toggleAllCheckbox).not.toBeChecked();
      await expect(todoPage.todoItems).toHaveClass(['', '', '']);
      await expect(todoPage.itemsLeftCount).toHaveText('3 items left');
    });
  });

  test('BTN02 - Verify Filter buttons ("All", "Active", "Completed") and active state styling', async ({
    todoPage,
  }) => {
    await test.step('Complete the second item to have mixed status', async () => {
      await todoPage.toggleItemByIndex(1); // Marks 'Verify Button States & Interactivity' complete
      await expect(todoPage.itemsLeftCount).toHaveText('2 items left');
    });

    await test.step('Verify default "All" filter button is selected', async () => {
      await expect(todoPage.allFilterButton).toHaveClass(/selected/);
      await expect(todoPage.todoItems).toHaveCount(3);
    });

    await test.step('Click "Active" filter button and verify view', async () => {
      await todoPage.filterBy('Active');
      await expect(todoPage.activeFilterButton).toHaveClass(/selected/);
      await expect(todoPage.allFilterButton).not.toHaveClass(/selected/);
      await todoPage.verifyUrlContains('#/active');

      const activeTitles = await todoPage.getVisibleItemTitles();
      expect(activeTitles).toEqual([
        'Learn Playwright Locators',
        'Write Clean Page Objects',
      ]);
    });

    await test.step('Click "Completed" filter button and verify view', async () => {
      await todoPage.filterBy('Completed');
      await expect(todoPage.completedFilterButton).toHaveClass(/selected/);
      await expect(todoPage.activeFilterButton).not.toHaveClass(/selected/);
      await todoPage.verifyUrlContains('#/completed');

      const completedTitles = await todoPage.getVisibleItemTitles();
      expect(completedTitles).toEqual(['Verify Button States & Interactivity']);
    });

    await test.step('Return to "All" filter view', async () => {
      await todoPage.filterBy('All');
      await expect(todoPage.allFilterButton).toHaveClass(/selected/);
      await expect(todoPage.todoItems).toHaveCount(3);
    });
  });

  test('BTN03 - Verify "Clear completed" button dynamic visibility and action', async ({
    todoPage,
  }) => {
    await test.step('When no items are completed, "Clear completed" button is hidden', async () => {
      await expect(todoPage.clearCompletedButton).toBeHidden();
    });

    await test.step('Complete one item and verify "Clear completed" button becomes visible', async () => {
      await todoPage.toggleItemByIndex(0);
      await expect(todoPage.clearCompletedButton).toBeVisible();
    });

    await test.step('Click "Clear completed" button and verify item is removed', async () => {
      await todoPage.clickClearCompleted();
      await expect(todoPage.todoItems).toHaveCount(2);

      const remainingTitles = await todoPage.getVisibleItemTitles();
      expect(remainingTitles).toEqual([
        'Verify Button States & Interactivity',
        'Write Clean Page Objects',
      ]);

      // Since no items remain completed, button should disappear
      await expect(todoPage.clearCompletedButton).toBeHidden();
    });
  });

  test('BTN04 - Verify individual item Delete (Destroy) button on hover', async ({
    todoPage,
  }) => {
    await test.step('Delete the first item using its destroy button', async () => {
      await todoPage.deleteItemByIndex(0);

      await expect(todoPage.todoItems).toHaveCount(2);
      await expect(todoPage.itemsLeftCount).toHaveText('2 items left');

      const currentTitles = await todoPage.getVisibleItemTitles();
      expect(currentTitles).not.toContain('Learn Playwright Locators');
    });
  });
});
