//make sure playwright is 1.50.1 because otherwise page.goto won't work with experimental
import { test, expect } from "next/experimental/testmode/playwright";

test('load images and fullsize dialog works', async ({ page, next }) => {
    // Listen for any fetch requests
    const test_name = 'group1';
    const test_filename = 'test.jpg';
    const test_group = '123asdfasdf';
    const test_id = '456lkjhasdf';
    const mock_date = '2025-01-01T00:00:00.859000';
    next.onFetch((request) => {
        if (request.url.includes('lambda-url')) {
            return new Response(JSON.stringify(
            {
                id:test_group,
                name:test_name,
                created_at:mock_date,
                updated_at:mock_date,
                images:[
                    {
                        id:test_id,
                        filename:test_filename,
                        created_at:mock_date,
                        updated_at:mock_date,
                        data:{
                            DateTime:mock_date,
                            DateTimeOriginal:mock_date,
                            OffsetTimeOriginal: "-07:00",
                            coords: {
                                latitude: 12.3456,
                                longitude: -45.678
                            }
                        }
                    }
                ]
            }));
        }

        // If the request is not lambda, abort it
        return "abort";
    });
    await page.goto(`/events/${test_group}`);

    // Expect a thumbnail of the image to exist
    const thumb_path = encodeURIComponent(`thumb/${test_group}/${test_filename}`);
    await expect(page.locator(`img[src*="${thumb_path}"]`)).toBeVisible();

    // Expect fullsize image to open
    await page.locator(`a[href*="fullsize/${test_group}/${test_filename}"]`).click();
    await expect(page.locator('dialog')).toBeVisible();
    const fullsize_path = encodeURIComponent(`fullsize/${test_group}/${test_filename}`);
    await expect(page.locator(`img[src*="${fullsize_path}"]`)).toBeVisible();
});