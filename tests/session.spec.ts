//make sure playwright is 1.50.1 because otherwise page.goto won't work with experimental
import { test, expect } from "next/experimental/testmode/playwright";
//import { generateMockJWT, verifyMockJWT } from '../utils/mock-jwt';
//import { faker } from '@faker-js/faker';


    test('cognito session protection', async ({ page }) => {
        const logged_in_path = '/image_groups/create';
        await page.goto(logged_in_path);

        //expect redirect
        await expect(page).not.toHaveURL(new RegExp(`^${logged_in_path}`,'i'));
    });



    /* test('cognito session logged in', async ({ browser }) => {
        const loggedContext = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
        console.log('loaded new context');
        const page = await loggedContext.newPage();
        console.log('new page');
        await page.goto('/');
        await expect(page.locator('#logout-button')).toBeVisible();

    }); */