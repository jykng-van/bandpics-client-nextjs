//make sure playwright is 1.50.1 because otherwise page.goto won't work with experimental
import { test, expect } from "next/experimental/testmode/playwright";

test('cognito login redirect', async ({ page }) => {
    await page.goto('/');

    //click login
    await page.locator(`#login-button`).click();

    //redirect url
    const cognito_url = `https://${process.env.USER_POOL_ID?.replace('_','')}.auth.${process.env.COGNITO_REGION}.amazoncognito.com/`.replace('.','\\.');
    const cognito_client_id = process.env.COGNITO_CLIENT_ID as string;

    //expect redirect
    await expect(page).toHaveURL(new RegExp(`^${cognito_url}login.*client_id=${cognito_client_id}`,'i'));
});