/**
 * __await san.*function*__  
 * 
 * Functions to interact with the SAN assessment and Sentence Plan, and check results.
 * 
 * @module SAN Assessments
 */

import { Page } from '@playwright/test'

import { Element } from 'classes'
import {  Oasys, OasysDb, Sections, SentencePlan } from 'fixtures'
import * as pages from './pages'
import { sanIds } from './sanIds'
import * as exampleTest from './exampleTest'
import { Queries } from './queries'
import { Predictors } from 'fixtures/sections/pages/predictors'
import { Queries as AssessmentQueries } from 'fixtures/assessment/queries'


export class San {

    constructor(private readonly page: Page, private readonly oasys: Oasys, private readonly oasysDb: OasysDb) { }

    readonly sanSections = new pages.SanSections(this.page)
    readonly landingPage = new pages.LandingPage(this.page)

    readonly queries = new Queries(this.oasysDb, this.oasys)

    async populateMinimal(from: 'assessment' | 'offender' = 'assessment') {

        if (from == 'assessment') {
            await this.gotoSan()
        } else {
            await this.gotoSanFromOffender()
        }
        await this.populateSanSections('Minimally populate SAN sections', exampleTest.minimal, true)
        await this.returnToOASys()
    }

    /**
     * Navigates to the SAN assessment, assuming you are somewhere in the OASys assessment.
     * 
     * The optional parameters can be used to jump straight to a particular section, and optionally into the information or analysis subsections.
     */
    async gotoSan(section: SanSection = null, supressLog: boolean = false) {

        await this.sanSections.goto(true)
        await this.sanSections.openSan.click()

        await this.landingPage.confirmCheck.setValue(true)
        await this.landingPage.confirm.click()

        if (section) {
            await this.goto(section, supressLog)
        }
    }

    async gotoSanFromOffender(readonly = false) {

        await this.oasys.clickButton('Open S&N')
        if (!readonly) {
            await this.landingPage.confirmCheck.setValue(true)
            await this.landingPage.confirm.click()
        }
    }
    /**
     * Navigates to the SAN assessment in readonly mode (no landingPage), assuming you are somewhere in the OASys assessment.
     * 
     * The optional parameters can be used to jump straight to a particular section, and optionally into the information or analysis subsections.
     */
    async gotoSanReadOnly(section: SanSection = null) {

        await this.sanSections.goto(true)
        await this.sanSections.openSan.click()

        if (section) {
            await this.goto(section)
        }
    }

    /**
     * Select a SAN section on the menu using the text label on the menu
     */
    async goto(section: SanSection, supressLog: boolean = false) {

        await new pages.SectionLandingPage(this.page, section).goto(supressLog)
    }

    /**
     * Click on the Return to OASys button.
     */
    async returnToOASys() {

        await this.page.locator('#return-to-oasys').click()
    }

    /**
     * Check a text value on a readonly assessment.  Parameters are:
     *   - label: the text label for the item to be checked
     *   - text: the text to check
     */
    async checkReadonlyText(label: string, value: string) {

        const count = await this.page.locator('#main-content').locator(`.govuk-summary-list__row:has-text('${label}')`).filter({ hasText: value }).count()
        expect(count).toBeGreaterThan(0)
        log(`Checked value for ${label}`)
    }

    /**
     * Enter text in a date field.  Parameters are:
     *   - item: a SanId defining a San date group of textboxes (with an id that doesn't have the -day etc suffixes)
     *   - text: the date to enter - should be in 'DD/MM/YYYY' format
     */
    // async enterDate(item: SanId, value: string) {

    //     const dateValues = value.split('/')
    //     cy.get(`${item.id}-day`).clear()
    //     cy.get(`${item.id}-month`).clear()
    //     cy.get(`${item.id}-year`).clear()
    //     if (value) {
    //         cy.get(`${item.id}-day`).type(dateValues[0])
    //         cy.get(`${item.id}-month`).type(dateValues[1])
    //         cy.get(`${item.id}-year`).type(dateValues[2])
    //     }
    // }

    /**
     * Run the specified script to enter values in the SAN assessment, return to OASys and check values in the database.
     * Parameters are:
     *   - assessmentPk: the oasys_set_pk used to check values in the database
     *   - a SanScript test script object (includes selection ids and one or more scenarios including test steps and expected OASys database values)
     *   - a result alias to return a boolean status - true if the script failed on one or more of the OASys values
     *   - reset130 (optional) - if true, the value of question 1.30 on the Predictors page will be reset between scenarios.
     */
    async runScript(assessmentPk: number, script: SanScript, reset130: boolean = false, predictors?: Predictors): Promise<boolean> {

        let failed = false

        for (let scenario of script.scenarios) { // Loop through scenarios in the script

            await this.gotoSan(script.section, true)
            await this.runScenario(scenario.name, scenario.steps, true)
            await this.returnToOASys()
            await this.oasys.clickButton('Previous', true)

            const updateTimeFailed = await this.queries.checkLastUpdateTime(assessmentPk)
            const getAssessmentCallFailed = await this.queries.checkSanGetAssessmentCall(assessmentPk, 0, true)
            const answersFailed = await new AssessmentQueries(this.oasysDb).checkAnswers(assessmentPk, scenario.oasysAnswers, true)

            if (updateTimeFailed || getAssessmentCallFailed || answersFailed) {
                failed = true
                log('', `Scenario ${scenario.name} FAILED`)
            }

            if (reset130) {  // OA testing requires 1.30 to be reset between scenarios because a YES will not be overwritten
                await this.gotoSan()
                await this.populateSanSections('Reset 1.30', reset)  // Change OA details to allow 1.30 to be editable
                await this.returnToOASys()
                await predictors.goto()
                await predictors.o1_30.setValue('')
            }
        }

        return failed
    }

    /**
     * Populate one or more sections of a SAN assessment.
     *  - name: text for reporting purposes
     *  - script: a SanPopulation object defining questions/values/button clicks for one or more sections.
     */
    async populateSanSections(name: string, script: SanPopulation, suppressLog: boolean = false) {

        if (suppressLog) {  // Just log the name
            log(name, 'Populating SAN Sections')
        }
        for (let section of script) {
            if (section.section != 'Sentence plan') {
                await this.goto(section.section, suppressLog)
            }
            await this.runScenario(`${name} / ${section.section}`, section.steps, suppressLog)
        }
    }

    /**
     * Populate the currently selected section in a SAN assessment.
     *  - name: text for reporting purposes
     *  - steps: a SanStep array defining all of the questions/values/button clicks required.
     */
    async runScenario(name: string, steps: SanStep[], suppressLog = false) {

        if (!suppressLog) {
            log(' ', '')
            log('', `Scenario: ${name}`)
            console.log(`Scenario: ${name}`)
        }
        for (let step of steps) {
            await this.runStep(step, suppressLog)
        }
    }

    /**
     * Execute a single test step on a SAN or SP screen, e.g. set a value or click a button.  The SanStep parameter defines the item and value(s) required.
     */
    async runStep(step: SanStep, suppressLog: boolean = false) {
        const stepItem = sanIds[step.item]
        if (stepItem == undefined) {
            throw new Error(`Invalid item name: ${step.item}`)
        }

        switch (stepItem.type) {
            case 'radio':
                await Element.Radiogroup.sanSetValue(this.page, stepItem, step.value)
                if (!suppressLog) log(`Radio: ${step.item} - '${step.value}'`)
                break
            case 'checkbox':
                await Element.Checkbox.sanSetValue(this.page, stepItem, step.value)
                if (!suppressLog) log(`Checkbox: ${step.item} - '${step.value}'`)
                break
            case 'textbox':
                await Element.Textbox.sanSetValue(this.page, stepItem, step.value)
                if (!suppressLog) log(`Textbox: ${step.item} - '${step.value.length > 50 ? step.value.substring(0, 50) + '...' : step.value}'`)
                break
            case 'combo':
                await Element.Combo.sanSetValue(this.page, stepItem, step.value)
                if (!suppressLog) log(`Combo: ${step.item} - '${step.value}'`)
                break
            case 'select':
                await Element.Select.sanSetValue(this.page, stepItem, step.value)
                if (!suppressLog) log(`Select: ${step.item} - '${step.value}'`)
                break
            case 'date':
                // await this.enterDate(stepItem, step.value)
                // log(`Date: ${step.item} - '${step.value}'`)
                break
            case 'action':
                await this.action(step.item)
                if (!suppressLog) log(`Action: ${step.item}`)
                break
            case 'button':
                await Element.Button.sanClick(this.page, stepItem)
                if (!suppressLog) log(`Button: ${step.item}`)
                break
        }
    }

    /**
     * Execute a single action-type test step (e.g. clicking a button).
     */
    async action(action: string) {

        switch (action) {
            case 'change':
                await this.page.locator('.govuk-link:visible').filter({ hasText: 'Change' }).first().click()
                break
            case 'change2':
                await this.page.locator('.govuk-link.change-entry:visible').nth(1).click()
                break
            case 'change3':
                await this.page.locator('.govuk-link.change-entry:visible').nth(2).click()
                break
            case 'back':
                await this.page.locator('.govuk-back-link').first().click()
                break
            // case 'backIfVisible':
            //     cy.get('#main-content').then((container) => {  // inconsistent behaviour in drugs section, so check for visibility of Back link
            //         const backLinks = container.find('.govuk-back-link:visible')
            //         if (backLinks.length > 0) {
            //             backLinks[0].click()
            //         }
            //     })
            //     break
            // case 'changeIfVisible':
            //     cy.get('#main-content').then((container) => {
            //         const changeLinks = container.find('.govuk-link:visible:contains("Change")')
            //         if (changeLinks.length > 0) {
            //             changeLinks[0].click()
            //         }
            //     })
            //     break
            case 'practitionerAnalysis':
                await this.page.locator('#tab_practitioner-analysis').first().click()
                break
            case 'changeAnalysis':
                await this.page.locator('a[href*="-analysis"]').filter({ hasText: 'Change' }).first().click()
                break
            case 'continue':
                await this.page.locator('.questiongroup-action-buttons .govuk-button').first().click()
                break
        }
    }


    /**
     * Checks the floating menu to see if sections 2 to 13 and the self-assessment form are there or not, and checks for the SAN and SP sections.
     * Parameter is true for SAN mode, false for normal OASys mode (layer 3.1), the test fails if the menu is not as expected.
     */
    async checkLayer3Menu(sanMode: boolean, sections: Sections, sentencePlan: SentencePlan) {

        await sections.section2.checkMenuVisibility(!sanMode)
        await sections.section3.checkMenuVisibility(!sanMode)
        await sections.section4.checkMenuVisibility(!sanMode)
        await sections.section5.checkMenuVisibility(!sanMode)
        await sections.section6.checkMenuVisibility(!sanMode)
        await sections.section7.checkMenuVisibility(!sanMode)
        await sections.section8.checkMenuVisibility(!sanMode)
        await sections.section9.checkMenuVisibility(!sanMode)
        await sections.section10.checkMenuVisibility(!sanMode)
        await sections.section11.checkMenuVisibility(!sanMode)
        await sections.section12.checkMenuVisibility(!sanMode)
        await sections.section13.checkMenuVisibility(!sanMode)
        await sections.selfAssessmentForm.checkMenuVisibility(!sanMode)
        await this.sanSections.checkMenuVisibility(sanMode)
        await sentencePlan.spService.sentencePlanService.checkMenuVisibility(true)
    }



    // /**
    //  * Checks that the sections (plus SAF) are all either marked as complete on not.
    //  */
    // async checkSections2To13AndSafCompletionStatus(expectedStatus: boolean) {

    //     new oasys.Pages.Assessment.Section2().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.Section3().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.Section4().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.Section5().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.Section6().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.Section7().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.Section8().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.Section9().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.Section10().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.Section11().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.Section12().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.Section13().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.SelfAssessmentForm().checkCompletionStatus(expectedStatus)
    // }

    // /**
    //  * Checks that the sections in an OASys SAN assessment are all marked complete or not on the floating menu.
    //  */
    // async checkSanAssessmentCompletionStatus(expectedStatus: boolean) {

    //     new oasys.Pages.Assessment.OffenderInformation().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.SourcesOfInformation().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.OffendingInformation().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.Predictors().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Assessment.SanSections().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Rosh.RoshScreeningSection1().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Rosh.RoshScreeningSection2to4().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.Rosh.RoshScreeningSection5().checkCompletionStatus(expectedStatus)
    //     new oasys.Pages.SentencePlan.SentencePlanService().checkCompletionStatus(expectedStatus)
    // }

    // /**
    //  * Assuming you are in the SAN assessment, check that the specified number of SAN sections are showing as complete.
    //  */
    // async checkSanSectionsCompletionStatus(expectComplete: number) {

    //     cy.get('.moj-side-navigation__list').then((container) => {
    //         const ticks = container.find('.section-complete').length
    //         if (ticks != expectComplete) {
    //             throw new Error(`Expected ${expectComplete} sections to be complete, found ${ticks}`)
    //         }
    //         log(`Checked SAN sections completion status: ${expectComplete} sections complete.`)
    //     })
    // }

    /**
     * Assuming you are in a SAN screen (not the section landing screen), checks that it is in edit mode (true) or readonly mode (false).  Test fails if not.
     */
    async checkSanEditMode(expectEdit: boolean) {

        const saveButtons = await this.page.locator('.govuk-button').filter({ hasText: 'Save and continue' }).count()
        const changeLinks = await this.page.locator('.govuk-link').filter({ hasText: 'Change' }).count()

        if (expectEdit && saveButtons == 0 && changeLinks == 0) {
            throw new Error(`Expected SAN to be in edit mode`)
        }
        if (!expectEdit && (saveButtons > 0 || changeLinks > 0)) {
            throw new Error(`Expected SAN NOT to be in edit mode`)
        }
        log(`Checked SAN edit mode: ${expectEdit}.`)
    }

}
function arraySort(a: object, b: object): number {

    const aString = concatObject(a)
    const bString = concatObject(b)

    return aString > bString ? 1 : aString < bString ? -1 : 0
}

function concatObject(obj: object): string {

    // Concatenate all properties in an object to create a sort order
    let result = ''
    Object.keys(obj).sort().forEach((key) => {
        result += obj[key]
    })
    return result
}

// Change SAN values to allow 1.30 to be editable in OASys
const reset: SanPopulation = [
    {
        section: 'Offence analysis',
        steps: [
            { item: 'changeIfVisible' },
            { item: 'backIfVisible' },
            { item: 'backIfVisible' },
            { item: 'offenceElements', value: `arson` },
            { item: 'motivations', value: `addictions` },
            { item: 'saveAndContinue' },
        ],
    }
]