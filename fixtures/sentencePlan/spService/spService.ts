import { Page, expect } from '@playwright/test'

import * as pages from './pages'
import { Oasys } from 'fixtures/oasys/oasys'
import * as lib from 'lib'


export class SpService {

    constructor(readonly page: Page, readonly oasys: Oasys) { }

    readonly sentencePlanService = new pages.SentencePlanService(this.page)
    readonly landingPage = new pages.LandingPage(this.page)
    readonly sentencePlan = new pages.SentencePlan(this.page)
    readonly steps = new pages.Steps(this.page)
    readonly agreePlan = new pages.AgreePlan(this.page)


    async goToSpService(from: 'offender' | 'assessment', readonly: boolean = false) {

        if (from == 'offender') {
            await this.oasys.clickButton('Open SP')
        } else {
            await this.sentencePlanService.goto(true)
            await this.sentencePlanService.openSp.click()
        }
        if (!readonly) {
            await this.landingPage.confirmCheck.setValue(true)
            await this.landingPage.confirm.click()
        }
    }

    async returnToOasys() {

        await this.oasys.clickButton('Return to OASys')
    }

    async openAndReturn(from: 'offender' | 'assessment', readonly: boolean = false) {

        await this.goToSpService(from, readonly)
        await this.returnToOasys()
    }

    async populateMinimal() {

        await this.sentencePlan.createGoal.click()

        const createGoal = new pages.CreateGoal(this.page)
        await createGoal.goal.setValue('Score a goal')
        await createGoal.related.setValue('no')
        await createGoal.startNow.setValue('yes')
        await createGoal.targetDate.setValue('3months')
        await createGoal.addSteps.click()

        await this.steps.who.setValue('probation_practitioner')
        await this.steps.step.setValue('Do some stuff')
        await this.steps.saveAndContinue.click()

        await this.sentencePlan.agreePlan.click()
        await this.page.getByRole('radio', { name: 'Yes, I agree' }).check()
        await this.page.getByRole('button', { name: 'Save' }).click()

        await this.returnToOasys()
    }

    async populateTwoGoals() {

        await this.sentencePlan.createGoal.click()

        const createGoal = new pages.CreateGoal(this.page)
        await createGoal.goal.setValue('Score a goal')
        await createGoal.related.setValue('no')
        await createGoal.startNow.setValue('yes')
        await createGoal.targetDate.setValue('3months')
        await createGoal.addSteps.click()

        await this.page.getByLabel('Who will do the step?').selectOption('probation_practitioner')
        await this.page.getByRole('textbox', { name: 'What should they do to' }).fill('Do stuff')
        await this.page.getByRole('button', { name: 'Save and continue' }).click()

        await this.sentencePlan.createGoal.click()

        await createGoal.goal.setValue('Do something else')
        await createGoal.related.setValue('no')
        await createGoal.startNow.setValue('yes')
        await createGoal.targetDate.setValue('6months')
        await createGoal.addSteps.click()

        await this.page.getByLabel('Who will do the step?').selectOption('probation_practitioner')
        await this.page.getByRole('textbox', { name: 'What should they do to' }).fill('Some other stuff')

        await this.page.getByRole('button', { name: 'Save and continue' }).click()
        await this.page.getByRole('button', { name: 'Agree plan' }).click()
        await this.page.getByRole('radio', { name: 'Yes, I agree' }).check()
        await this.page.getByRole('button', { name: 'Save' }).click()
    }

    async checkReadOnly(from:  'assessment' | 'offender' = 'assessment') {

        await this.goToSpService(from, true)
        const createGoalStatus = await this.sentencePlan.createGoal.getStatus()
        expect(createGoalStatus).not.toBe('enabled')
        await this.returnToOasys()
    }

    async checkGoalCount(expectedCurrent: number, expectedFuture: number, from: 'assessment' | 'offender' = 'assessment', readonly: boolean = false) {

        lib.log(`Checking SP goal count: ${expectedCurrent}, ${expectedFuture}`)
        await this.goToSpService(from, readonly)
        const currentText = await this.sentencePlan.currentGoalCount.getFullText()
        const futureText = await this.sentencePlan.futureGoalCount.getFullText()

        const actualCurrent = this.findGoalCount(currentText)
        const actualFuture = this.findGoalCount(futureText)

        expect(actualCurrent).toBe(expectedCurrent)
        expect(actualFuture).toBe(expectedFuture)
        await this.returnToOasys()
    }

    private findGoalCount(linkText: string): number {

        const openBracket = linkText.indexOf('(')
        const closeBracket = linkText.indexOf(')')
        try {
            return Number.parseInt(linkText.substring(openBracket + 1, closeBracket))
        } catch (e) {
            return null
        }

    }

    async addGoal(page: Page, sentencePlan: pages.SentencePlan) {

        await sentencePlan.createGoal.click()

        const createGoal = new pages.CreateGoal(this.page)
        await createGoal.goal.setValue('Adding a goal')
        await createGoal.related.setValue('no')
        await createGoal.startNow.setValue('yes')
        await createGoal.targetDate.setValue('3months')
        await createGoal.addSteps.click()

        await this.page.getByLabel('Who will do the step?').selectOption('probation_practitioner')
        await this.page.getByRole('textbox', { name: 'What should they do to' }).fill('Do some additional stuff')
        await this.page.getByRole('button', { name: 'Save and continue' }).click()
    }

}