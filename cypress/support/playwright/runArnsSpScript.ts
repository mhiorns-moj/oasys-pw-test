import { chromium, Page, expect } from '@playwright/test'
import { testEnvironment } from '../../../localSettings'
import * as pagesSp from './arnsSpPages'
import * as pages from './pages'

const debug = false

// Return error text, or null if passed
export async function runArnsSpScript(params: ArnsSpParams): Promise<string> {

    let result: string = null

    const browser = await chromium.launch({ headless: !debug })
    const context = await browser.newContext()
    const page = await context.newPage()

    // Login again as the same user
    await page.goto(testEnvironment.url)
    await page.getByRole('textbox', { name: 'Username' }).fill(params.username)
    await page.getByRole('textbox', { name: 'Password' }).fill(params.password)
    await page.getByRole('button', { name: 'Login' }).click()
    if (params.provider != null) {

    } // TODO

    // Go back to the same place (offender or assessment)
    await page.getByRole('menuitem', { name: 'History' }).click()
    await page.locator('#history_1').click()

    // Open the SP page
    if (params.openFromOffender) {
        await page.getByRole('button', { name: 'Open SP' }).click()
    } else {
        await page.getByRole('link', { name: 'Sentence Plan Service' }).click()
        await page.getByRole('button', { name: 'Open Sentence Plan Service' }).click()
    }

    // Handle landing page if not readonly
    if (!params.readonly && params.script != 'checkReadOnly') {
        await page.locator(pagesSp.landingPage.confirmCheck).check()
        await page.getByRole('button', { name: 'Confirm' }).click()
    }

    const sentencePlan = new pages.SentencePlan(page)

    switch (params.script) {
        case 'populateMinimal':
            await populateMinimal(page, sentencePlan)
            break
        case 'openAndReturn':
            break
        case 'checkReadOnly':
            result = await checkReadOnly(sentencePlan)
            break
        case 'checkZeroGoals':
            result = await checkGoalCount(sentencePlan, 0, 0)
            break
        case 'populateTwoGoals':
            await populateTwoGoals(page, sentencePlan)
            break
    }

    await sentencePlan.returnToOASys.click()

    await page.getByRole('button', { name: 'Logout' }).click()

    if (!debug) {
        await browser.close()
    }

    return result
}

async function populateMinimal(page: Page, sentencePlan: pages.SentencePlan) {

    await sentencePlan.createGoal.click()

    const createGoal = new pages.CreateGoal(page)
    await createGoal.goal.setValue('Score a goal')
    await createGoal.related.setValue('no')
    await createGoal.startNow.setValue('yes')
    await createGoal.targetDate.setValue('3months')
    await createGoal.addSteps.click()

    await page.getByLabel('Who will do the step?').selectOption('probation_practitioner')
    await page.getByRole('textbox', { name: 'What should they do to' }).fill('Do stuff')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('button', { name: 'Agree plan' }).click()
    await page.getByRole('radio', { name: 'Yes, I agree' }).check()
    await page.getByRole('button', { name: 'Save' }).click()
}

async function populateTwoGoals(page: Page, sentencePlan: pages.SentencePlan) {

    await sentencePlan.createGoal.click()

    const createGoal = new pages.CreateGoal(page)
    await createGoal.goal.setValue('Score a goal')
    await createGoal.related.setValue('no')
    await createGoal.startNow.setValue('yes')
    await createGoal.targetDate.setValue('3months')
    await createGoal.addSteps.click()

    await page.getByLabel('Who will do the step?').selectOption('probation_practitioner')
    await page.getByRole('textbox', { name: 'What should they do to' }).fill('Do stuff')
    await page.getByRole('button', { name: 'Save and continue' }).click()

    await sentencePlan.createGoal.click()

    await createGoal.goal.setValue('Do something else')
    await createGoal.related.setValue('no')
    await createGoal.startNow.setValue('yes')
    await createGoal.targetDate.setValue('6months')
    await createGoal.addSteps.click()

    await page.getByLabel('Who will do the step?').selectOption('probation_practitioner')
    await page.getByRole('textbox', { name: 'What should they do to' }).fill('Some other stuff')

    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('button', { name: 'Agree plan' }).click()
    await page.getByRole('radio', { name: 'Yes, I agree' }).check()
    await page.getByRole('button', { name: 'Save' }).click()
}

async function checkReadOnly(sentencePlan: pages.SentencePlan): Promise<string> {

    const createGoalStatus = await sentencePlan.createGoal.checkStatus()
    return createGoalStatus == 'enabled' ? 'Sentence plan is not readonly' : null
}

async function checkGoalCount(sentencePlan: pages.SentencePlan, expectedCurrent: number, expectedFuture: number): Promise<string> {

    const currentText = await sentencePlan.currentGoalCount.getFullText()
    const futureText = await sentencePlan.futureGoalCount.getFullText()

    const actualCurrent = findGoalCount(currentText)
    const actualFuture = findGoalCount(futureText)

    const failed = actualCurrent != expectedCurrent || actualFuture != expectedFuture

    return failed ? `Current: expected ${expectedCurrent}, found ${actualCurrent}.  Future: expected ${expectedFuture}, found ${actualFuture}` : null
}

function findGoalCount(linkText: string): number {

    const openBracket = linkText.indexOf('(')
    const closeBracket = linkText.indexOf(')')
    try {
        return Number.parseInt(linkText.substring(openBracket + 1, closeBracket))
    } catch (e) {
        return null
    }

}
