//make sure playwright is 1.50.1 because otherwise page.goto won't work with experimental
import { test, expect } from "next/experimental/testmode/playwright";

test('load images and fullsize dialog works', async ({ page, next }) => {
    // Listen for any fetch requests
    const test_event_name = 'event1';
    const test_event_id = '123asdfasdf';
    const event_api_url = (process.env.NEXT_PUBLIC_EVENT_API_URL as string);

    const mock_date = '2025-01-01T00:00:00.859000';

    const test_group_id = '456lkjhasdf';
    const test_group_name = 'group1';

    const test_image_id = '6789asdf';
    const test_filename = 'test.jpg';
    const mock_date_transformed = 'Jan 01, 2025';
    const image_api_url = (process.env.NEXT_PUBLIC_IMAGE_API_URL as string);

    next.onFetch((request) => {
        if (request.url.includes(event_api_url)) {
            return new Response(JSON.stringify(
            [{
                id:test_event_id,
                name:test_event_name,
                created_at:mock_date,
                updated_at:mock_date,
            }]));
        }else if (request.url.includes(image_api_url)) {
            return new Response(JSON.stringify(
            [{
                id:test_group_id,
                name:test_group_name,
                created_at:mock_date,
                updated_at:mock_date,
                images:[
                    {
                        id:test_image_id,
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
            }]));
        }

        // If the request is not lambda, abort it
        return "abort";
    });

    await page.goto(`/events/${test_event_id}`);

    // Expect a thumbnail of the image to exist
    const thumb_path = encodeURIComponent(`thumb/${test_group_id}/${test_filename}`);
    await expect(page.locator(`img[src*="${thumb_path}"]`)).toBeVisible();

    // Expect fullsize image to open
    await page.locator(`a[href*="fullsize/${test_group_id}/${test_filename}"]`).click();
    await expect(page.locator('dialog#image-dialog')).toBeVisible(); //check for image dialog
    const fullsize_path = encodeURIComponent(`fullsize/${test_group_id}/${test_filename}`);
    await expect(page.locator(`img[src*="${fullsize_path}"]`)).toBeVisible(); //check for fullsize image

    //Additional info tests
    page.locator(`#image-toggle-info`).click();
    await expect(page.locator(`#additional-image-info h3`)).toContainText(test_filename); //check for filename
    await expect(page.locator(`#additional-image-info .date`)).toContainText(mock_date_transformed); //check for date
    await page.waitForFunction(() => { //test for the presence of google maps
        return typeof window.google === 'object' && typeof window.google.maps === 'object';
    }, { timeout: 10000 }); // Adjust timeout as needed

});