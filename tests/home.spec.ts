//make sure playwright is 1.50.1 because otherwise page.goto won't work with experimental
import { test, expect } from "next/experimental/testmode/playwright";

test('has mock image groups', async ({ page, next }) => {
    // Listen for any fetch requests
    const test_name = 'Test Image Group'
    const test_id = '123asdfasdf';
    const mock_date = '2025-01-01T00:00:00.859000';
    next.onFetch((request) => {
        if (request.url.includes('lambda-url')) {
            return new Response(JSON.stringify(
                [
                    { name: test_name, id: test_id, created_at:mock_date, updated_at:mock_date }
                ]
            ));
        }

        // If the request is not lambda, abort it
        return "abort";
    });
    await page.goto('/');

    // Expect there to be a H1
    await expect(page.getByRole('heading', {level:1})).toBeVisible();

    // Expect the link to an image group based on the test data above will be found
    await expect(page.locator(`a:has-text("${test_name}")[href*="${test_id}"]`)).toBeVisible();
});
