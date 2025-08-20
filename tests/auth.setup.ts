import { test as setup } from '@playwright/test';
//import { generateMockJWT } from '../utils/mock-jwt';
//import { faker } from '@faker-js/faker';


setup('Setup JWT session', async ({page})=>{
    console.log('Running Setup');
    /*
    Do some things like create a temporary user and then login as them...
    */

    await page.context().storageState({path:'playwright/.auth/user.json'});

});