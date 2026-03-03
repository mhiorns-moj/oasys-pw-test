import { expect, LaunchOptions, chromium } from '@playwright/test'
import { testEnvironment } from '../../../localSettings'
import * as pages from './sanSpPages'

export async function newSp1(username: string) {

    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(testEnvironment.url)
    await page.getByRole('textbox', { name: 'Username' }).fill(username)
    await page.getByRole('textbox', { name: 'Password' }).fill(testEnvironment.standardUserPassword)
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByRole('menuitem', { name: 'History' }).click()
    await page.locator('#history_1').click()
    await page.getByRole('link', { name: 'Sentence Plan Service' }).click()
    await page.getByRole('button', { name: 'Open Sentence Plan Service' }).click()

    await page.locator(pages.landingPage.confirmCheck).check()
    await page.getByRole('button', { name: 'Confirm' }).click()

    await page.getByRole('button', { name: 'Create goal' }).click()
    await page.getByRole('combobox', { name: 'What goal should Autotest try' }).fill('Score a goal')
    await page.getByRole('radio', { name: 'No', exact: true }).check()
    await page.getByRole('group', { name: 'Can Autotest start working on' }).getByLabel('Yes').check()
    await page.locator(pages.createGoal.targetDate).check()
    await page.getByRole('button', { name: 'Add Steps' }).click()
    await page.getByLabel('Who will do the step?').selectOption('probation_practitioner')
    await page.getByRole('textbox', { name: 'What should they do to' }).fill('Do stuff')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('button', { name: 'Agree plan' }).click()
    await page.getByRole('radio', { name: 'Yes, I agree' }).check()
    await page.getByRole('button', { name: 'Save' }).click()
    await page.getByRole('button', { name: 'Return to OASys' }).click()
    await page.getByRole('button', { name: 'Logout' }).click()

    await browser.close()

    return null
}