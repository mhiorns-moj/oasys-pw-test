/**
 * __oasys.San.*function*__  
 * 
 * Functions to interact with the SAN assessment and Sentence Plan, and check results.
 * 
 * @module SAN Assessments
 */
import { User } from 'classes'

import * as oasys from 'oasys'
import { sanIds } from '../../tests/data/sanIds'
import { OasysDateTime } from 'oasys'
import { Temporal } from '@js-temporal/polyfill'

/**
 * Navigates to the SAN assessment, assuming you are somewhere in the OASys assessment.
 * 
 * The optional parameters can be used to jump straight to a particular section, and optionally into the information or analysis subsections.
 */
export function gotoSan(section: SanSection = null, subPage: 'information' | 'analysis' = null, supressLog: boolean = false) {

    new oasys.Pages.Assessment.SanSections().goto(supressLog).openSan.click()

    const landingPage = new oasys.Pages.San.LandingPage()
    landingPage.confirmCheck.setValue(true)
    landingPage.confirm.click()

    new oasys.Pages.San.SectionLandingPage('Accommodation')
    if (section) {
        goto(section, subPage, supressLog)
    }
}

export function gotoSanFromOffender() {

    new oasys.Pages.Offender.OffenderDetails().openSan.click()
    const landingPage = new oasys.Pages.San.LandingPage()
    landingPage.confirmCheck.setValue(true)
    landingPage.confirm.click()
}
/**
 * Navigates to the SAN assessment in readonly mode (no landingPage), assuming you are somewhere in the OASys assessment.
 * 
 * The optional parameters can be used to jump straight to a particular section, and optionally into the information or analysis subsections.
 */
export function gotoSanReadOnly(section: SanSection = null, subPage: 'information' | 'analysis' = null) {

    new oasys.Pages.Assessment.SanSections().goto().openSan.click()

    // new oasys.Pages.San.SectionLandingPage('Accommodation').checkCurrent()  Removed for release 1.11, titles vary depending on current state of the section
    if (section) {
        goto(section, subPage)
    }
}

/**
 * Select a SAN section on the menu using the text label on the menu
 */
export function goto(section: SanSection, subPage: 'information' | 'analysis' = null, supressLog: boolean = false) {

    const page = new oasys.Pages.San.SectionLandingPage(section).goto(supressLog)
    // Sub-page functionality removed for ARNS release 1.11, might come back later
    // if (subPage) {
    //     page[subPage].click()
    // }
}

/**
 * Checks that the SAN headers are visible on screen.
 */
export function checkSanLoaded(probationCrn: string, pnc: string) {

    cy.get('.hmpps-header__title__service-name').contains('Strengths and needs').should('be.visible')
    cy.get('dd').contains(probationCrn).should('be.visible')
    cy.get('dd').contains(pnc).should('be.visible')
}

/**
 * Click on the Return to OASys button.
 */
export function returnToOASys() {

    cy.get('a').contains('Return to OASys').click()
}

/**
 * Select an item in a radio group.  Parameters are:
 *   - item: a SanId defining a San radio group
 *   - value: name of the item to select
 */
export function selectRadio(item: SanId, value: string) {

    const itemNo = item.options.indexOf(value)
    const itemSuffix = itemNo == 0 ? '' : `-${itemNo + 1}`  // First item has no suffix on the id used to find it, remainder are -2, -3 etc
    cy.get(`${item.id}${itemSuffix}`).click()
}

/**
 * Select any number of items in a group of checkboxes.  Parameters are:
 *   - item: a SanId defining a San checkbox group
 *   - item: comma-separated list of the name(s) of the item(s) to select.  Any options not included in the list will be unchecked (empty string to clear all).
 */
export function selectCheckbox(item: SanId, value: string) {

    const itemsToCheck = value.split(',').map((item) => item.trim())
    for (let i = 0; i < item.options.length; i++) {
        const itemSuffix = i == 0 ? '' : `-${i + 1}`
        if (itemsToCheck.includes(item.options[i])) {
            cy.get(`${item.id}${itemSuffix}`).check()
        } else if (item.options[i] != '-') {   // '-' is used as a separator in the list of IDs
            cy.get(`${item.id}${itemSuffix}`).uncheck()
        }
    }
}

/**
 * As above, but some options may not be visible
 */
export function selectConditionalCheckbox(item: SanId, value: string) {

    const itemsToCheck = value.split(',').map((item) => item.trim())
    for (let i = 0; i < item.options.length; i++) {
        const itemSuffix = i == 0 ? '' : `-${i + 1}`
        if (itemsToCheck.includes(item.options[i])) {
            cy.get(`${item.id}${itemSuffix}`).check()
        } else if (item.options[i] != '-') {   // '-' is used as a separator in the list of IDs
            cy.get('#main-content').then((container) => {
                const checkboxVisible = container.find(`${item.id}${itemSuffix}:visible`).length == 1
                if (checkboxVisible) {
                    cy.get(`${item.id}${itemSuffix}`).uncheck()
                }
            })
        }
    }
}
/**
 * Enter text in a textbox.  Parameters are:
 *   - item: a SanId defining a San textbox
 *   - text: the text to enter
 */
export function enterText(item: SanId, value: string) {

    cy.get(item.id).clear({ force: true })
    if (value) {
        if (value.length > 50) {
            cy.get(item.id).invoke('val', value)
        } else {
            cy.get(item.id).type(value)
        }
    }
}

/**
 * Check the text in a textbox.  Parameters are:
 *   - item: a SanId defining a San textbox
 *   - text: the text to check
 */
export function checkText(item: SanId, value: string) {

    cy.get(item.id).should('have.value', value)
}

/**
 * Check a text value on a readonly assessment.  Parameters are:
 *   - label: the text label for the item to be checked
 *   - text: the text to check
 */
export function checkReadonlyText(label: string, value: string) {

    cy.get('#main-content').then((container) => {
        const div = container.find(`.govuk-summary-list__row:contains('${label}')`)
        expect(div[0].innerHTML.search(value)).gt(0)
        cy.log(`Checked value for ${label}`)
    })
}

/**
 * Select an item in a combo box.  Parameters are:
 *   - item: a SanId defining a San combo
 *   - text: the text to select
 */
export function selectCombo(item: SanId, value: string) {

    cy.get(item.id).clear()
    if (value) {
        cy.get(item.id).type(value)
        cy.get(`${item.id}__listbox`).click()
    }
}

/**
 * Select an item in a select list.  Parameters are:
 *   - item: a SanId defining a San listbox
 *   - text: the text to select
 */
export function selectList(item: SanId, value: string) {

    if (value) {
        cy.get(item.id).select(value)
    }
}

/**
 * Enter text in a date field.  Parameters are:
 *   - item: a SanId defining a San date group of textboxes (with an id that doesn't have the -day etc suffixes)
 *   - text: the date to enter - should be in 'DD/MM/YYYY' format
 */
export function enterDate(item: SanId, value: string) {

    const dateValues = value.split('/')
    cy.get(`${item.id}-day`).clear()
    cy.get(`${item.id}-month`).clear()
    cy.get(`${item.id}-year`).clear()
    if (value) {
        cy.get(`${item.id}-day`).type(dateValues[0])
        cy.get(`${item.id}-month`).type(dateValues[1])
        cy.get(`${item.id}-year`).type(dateValues[2])
    }
}

/**
 * Run the specified script to enter values in the SAN assessment, return to OASys and check values in the database.
 * Parameters are:
 *   - assessmentPk: the oasys_set_pk used to check values in the database
 *   - a SanScript test script object (includes selection ids and one or more scenarios including test steps and expected OASys database values)
 *   - a result alias to return a boolean status - true if the script failed on one or more of the OASys values
 *   - reset130 (optional) - if true, the value of question 1.30 on the Predictors page will be reset between scenarios.
 */
export function runScript(assessmentPk: number, script: SanScript, resultAlias: string, reset130: boolean = false) {

    cy.wrap(false).as(resultAlias)

    for (let i = 0; i < script.scenarios.length; i++) {  // Loop through scenarios in the script
        let scenario = script.scenarios[i]
        cy.wrap(false).as(`failedAlias${i}`)

        gotoSan(script.section, script.section == 'Offence analysis' ? null : 'information')
        cy.task('consoleLog', scenario.name)
        runScenario(scenario.name, scenario.steps)
        returnToOASys()
        oasys.Nav.clickButton('Previous')

        checkLastUpdateTime(assessmentPk, `failedAlias${i}`)
        oasys.Db.checkAnswers(assessmentPk, scenario.oasysAnswers, `failedAlias${i}`)
        checkSanGetAssessmentCall(assessmentPk, 0)
        if (reset130) {  // OA testing requires 1.30 to be reset between scenarios because a YES will not be overwritten
            gotoSan()
            populateSanSections('Reset 1.30', reset)  // Change OA details to allow 1.30 to be editable
            returnToOASys()
            new oasys.Pages.Assessment.Predictors().goto().o1_30.setValue('')
        }
    }

    // Log statuses   
    cy.groupedLogStart('Summary')
    for (let i = 0; i < script.scenarios.length; i++) {
        cy.get<boolean>(`@failedAlias${i}`).then((failed) => {
            cy.groupedLog(`Scenario ${i + 1} ${failed ? 'failed' : 'passed'}`)
            if (failed) {
                cy.wrap(true).as(resultAlias)
            }
        })
    }
    cy.groupedLogEnd()
}

/**
 * Populate one or more sections of a SAN assessment.
 *  - name: text for reporting purposes
 *  - script: a SanPopulation object defining questions/values/button clicks for one or more sections.
 */
export function populateSanSections(name: string, script: SanPopulation) {

    script.forEach((section) => {
        if (section.section != 'Sentence plan') {
            goto(section.section, section.section == 'Offence analysis' ? null : 'information')
        }
        runScenario(`${name} / ${section.section}`, section.steps)
    })
}

/**
 * Populate the currently selected section in a SAN assessment.
 *  - name: text for reporting purposes
 *  - steps: a SanStep array defining all of the questions/values/button clicks required.
 */
export function runScenario(name: string, steps: SanStep[]) {

    cy.groupedLogStart(`Scenario: ${name}`)
    steps.forEach((step) => {
        runStep(step)
    })
    cy.groupedLogEnd()
}

/**
 * Execute a single test step on a SAN or SP screen, e.g. set a value or click a button.  The SanStep parameter defines the item and value(s) required.
 */
export function runStep(step: SanStep) {
    const stepItem = sanIds[step.item]
    if (stepItem == undefined) {
        throw new Error(`Invalid item name: ${step.item}`)
    }

    switch (stepItem.type) {
        case 'radio':
            selectRadio(stepItem, step.value)
            cy.groupedLog(`Radio: ${step.item} - '${step.value}'`)
            break
        case 'checkbox':
            selectCheckbox(stepItem, step.value)
            cy.groupedLog(`Checkbox: ${step.item} - '${step.value}'`)
            break
        case 'conditionalCheckbox':
            selectConditionalCheckbox(stepItem, step.value)
            cy.groupedLog(`Checkbox: ${step.item} - '${step.value}'`)
            break
        case 'textbox':
            enterText(stepItem, step.value)
            cy.groupedLog(`Textbox: ${step.item} - '${step.value.length > 50 ? step.value.substring(0, 50) + '...' : step.value}'`)
            break
        case 'combo':
            selectCombo(stepItem, step.value)
            cy.groupedLog(`Combo: ${step.item} - '${step.value}'`)
            break
        case 'select':
            selectList(stepItem, step.value)
            cy.groupedLog(`Select: ${step.item} - '${step.value}'`)
            break
        case 'date':
            enterDate(stepItem, step.value)
            cy.groupedLog(`Date: ${step.item} - '${step.value}'`)
            break
        case 'action':
            action(step.item)
            cy.groupedLog(`Action: ${step.item}`)
            break
        case 'button':
            cy.get('.govuk-button').contains(stepItem.id).eq(0).click()
            break
    }
}

/**
 * Execute a single action-type test step (e.g. clicking a button).
 */
export function action(action: string) {

    switch (action) {
        case 'change':
            cy.get('.govuk-link:visible').contains('Change').eq(0).click()
            break
        case 'change2':
            cy.get('.govuk-link.change-entry:visible').eq(1).click()
            break
        case 'change3':
            cy.get('.govuk-link.change-entry:visible').eq(2).click()
            break
        case 'back':
            cy.get('.govuk-back-link').eq(0).click()
            break
        case 'backIfVisible':
            cy.get('#main-content').then((container) => {  // inconsistent behaviour in drugs section, so check for visibility of Back link
                const backLinks = container.find('.govuk-back-link:visible')
                if (backLinks.length > 0) {
                    backLinks[0].click()
                }
            })
            break
        case 'changeIfVisible':
            cy.get('#main-content').then((container) => {
                const changeLinks = container.find('.govuk-link:visible:contains("Change")')
                if (changeLinks.length > 0) {
                    changeLinks[0].click()
                }
            })
            break
        case 'practitionerAnalysis':
            //cy.get('.summary-action-buttons .govuk-button').eq(0).click()  Release 1.11 revert to previous navigation
            cy.get('#tab_practitioner-analysis').eq(0).click()
            break
        case 'changeAnalysis':
            cy.get('a[href*="-analysis"]').contains('Change').eq(0).click()
            break
        case 'continue':
            cy.get('.questiongroup-action-buttons .govuk-button').eq(0).click()
            break
    }
}


/**
 * Checks the floating menu to see if sections 2 to 13 and the self-assessment form are there or not, and checks for the SAN and SP sections.
 * Parameter is true for SAN mode, false for normal OASys mode (layer 3.1), the test fails if the menu is not as expected.
 */
export function checkLayer3Menu(sanMode: boolean, oldSp: boolean = false) {

    if (sanMode) {
        new oasys.Pages.Assessment.Section2().checkIsNotOnMenu()
        new oasys.Pages.Assessment.Section3().checkIsNotOnMenu()
        new oasys.Pages.Assessment.Section4().checkIsNotOnMenu()
        new oasys.Pages.Assessment.Section5().checkIsNotOnMenu()
        new oasys.Pages.Assessment.Section6().checkIsNotOnMenu()
        new oasys.Pages.Assessment.Section7().checkIsNotOnMenu()
        new oasys.Pages.Assessment.Section8().checkIsNotOnMenu()
        new oasys.Pages.Assessment.Section9().checkIsNotOnMenu()
        new oasys.Pages.Assessment.Section10().checkIsNotOnMenu()
        new oasys.Pages.Assessment.Section11().checkIsNotOnMenu()
        new oasys.Pages.Assessment.Section12().checkIsNotOnMenu()
        new oasys.Pages.Assessment.Section13().checkIsNotOnMenu()
        new oasys.Pages.Assessment.SelfAssessmentForm().checkIsNotOnMenu()
        new oasys.Pages.Assessment.SanSections().checkIsOnMenu()
        new oasys.Pages.SentencePlan.SentencePlanService().checkIsOnMenu()
    } else {
        new oasys.Pages.Assessment.Section2().checkIsOnMenu()
        new oasys.Pages.Assessment.Section3().checkIsOnMenu()
        new oasys.Pages.Assessment.Section4().checkIsOnMenu()
        new oasys.Pages.Assessment.Section5().checkIsOnMenu()
        new oasys.Pages.Assessment.Section6().checkIsOnMenu()
        new oasys.Pages.Assessment.Section7().checkIsOnMenu()
        new oasys.Pages.Assessment.Section8().checkIsOnMenu()
        new oasys.Pages.Assessment.Section9().checkIsOnMenu()
        new oasys.Pages.Assessment.Section10().checkIsOnMenu()
        new oasys.Pages.Assessment.Section11().checkIsOnMenu()
        new oasys.Pages.Assessment.Section12().checkIsOnMenu()
        new oasys.Pages.Assessment.Section13().checkIsOnMenu()
        new oasys.Pages.Assessment.SelfAssessmentForm().checkIsOnMenu()
        new oasys.Pages.Assessment.SanSections().checkIsNotOnMenu()
        if (oldSp) {
            new oasys.Pages.SentencePlan.SentencePlanService().checkIsNotOnMenu()
        } else {
            new oasys.Pages.SentencePlan.SentencePlanService().checkIsOnMenu()
        }
    }
}

/**
 * Check that no questions have been created in sections 2 to 13 and SAQ in the database for the given PK.
 * Three questions (8.4, 8.5, 8.6) are expected, any more will result in the test failing.
 */
export function checkNoQuestionsCreated(pk: number) {

    const query = `select count(*) from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q, eor.oasys_answer a
                    where st.oasys_set_pk = s.oasys_set_pk
                    and s.oasys_section_pk = q.oasys_section_pk
                    and q.oasys_question_pk = a.oasys_question_pk(+)
                    and s.ref_section_code in ('2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', 'SAQ')
                    and (a.ref_answer_code is not null or q.free_format_answer is not null or q.additional_note is not null)
                    and st.oasys_set_pk = ${pk}`
    cy.log(query)
    oasys.Db.selectCount(query, 'count')
    cy.get<number>('@count').then((count) => {
        cy.log(count.toString())
        if (count > 3) {    // Expect 3 questions to be populated by getAssessment (8.4, 8.5 and 8.6)
            throw new Error(`${count - 3} unexpected questions/answers found for assessment ${pk}`)
        }
    })

}

/**
 * Check that IP.1 and IP.2 have not been created in the database.
 */
export function checkNoIspQuestions1Or2(pk: number) {

    const query = `select count(*) from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q
                        where st.oasys_set_pk = s.oasys_set_pk
                        and s.oasys_section_pk = q.oasys_section_pk
                        and s.ref_section_code = 'ISP'
                        and q.ref_question_code in ('IP.1', 'IP.2')
                        and st.oasys_set_pk = ${pk}`

    oasys.Db.selectCount(query, 'count')
    cy.get<number>('@count').then((count) => {
        if (count > 0) {
            throw new Error(`Unexpected ISP questions found for assessment ${pk}`)
        }
    })
}

/**
 * Checks that the sections (plus SAF) are all either marked as complete on not.
 */
export function checkSections2To13AndSafCompletionStatus(expectedStatus: boolean) {

    new oasys.Pages.Assessment.Section2().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.Section3().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.Section4().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.Section5().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.Section6().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.Section7().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.Section8().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.Section9().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.Section10().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.Section11().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.Section12().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.Section13().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.SelfAssessmentForm().checkCompletionStatus(expectedStatus)
}

/**
 * Checks that the sections in an OASys SAN assessment are all marked complete or not on the floating menu.
 */
export function checkSanAssessmentCompletionStatus(expectedStatus: boolean) {

    new oasys.Pages.Assessment.OffenderInformation().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.SourcesOfInformation().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.OffendingInformation().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.Predictors().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Assessment.SanSections().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Rosh.RoshScreeningSection1().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Rosh.RoshScreeningSection2to4().checkCompletionStatus(expectedStatus)
    new oasys.Pages.Rosh.RoshScreeningSection5().checkCompletionStatus(expectedStatus)
}

/**
 * Assuming you are in the SAN assessment, check that the specified number of SAN sections are showing as complete.
 */
export function checkSanSectionsCompletionStatus(expectComplete: number) {

    cy.get('.moj-side-navigation__list').then((container) => {
        const ticks = container.find('.section-complete').length
        if (ticks != expectComplete) {
            throw new Error(`Expected ${expectComplete} sections to be complete, found ${ticks}`)
        }
        cy.log(`Checked SAN sections completion status: ${expectComplete} sections complete.`)
    })
}

/**
 * Assuming you are in a SAN screen (not the section landing screen), checks that it is in edit mode (true) or readonly mode (false).  Test fails if not.
 */
export function checkSanEditMode(expectEdit: boolean) {

    cy.get('#main-content').then((container) => {
        const saveButtons = container.find('.govuk-button:contains("Save and continue"):visible').length
        const changeLinks = container.find('.govuk-link:contains("Change"):visible').length

        if (expectEdit && saveButtons == 0 && changeLinks == 0) {
            throw new Error(`Expected SAN to be in edit mode`)
        }
        if (!expectEdit && (saveButtons > 0 || changeLinks > 0)) {
            throw new Error(`Expected SAN NOT to be in edit mode`)
        }
        cy.log(`Checked SAN edit mode: ${expectEdit}.`)
    })

}

/**
 * Checks that the last update time in oasys_set matches the current system time (with a 30 second tolerance) for a given assessment PK.
 * 
 * Returns a boolean result using the supplied alias (true if failed).
 */
export function checkLastUpdateTime(pk: number, resultAlias: string) {

    const query = `select to_char(lastupd_from_san, '${OasysDateTime.oracleTimestampFormat}'), to_char(sysdate, '${OasysDateTime.oracleTimestampFormat}') 
                    from eor.oasys_set where oasys_set_pk = ${pk}`

    oasys.Db.getData(query, 'updateTimes')
    cy.get<string[][]>('@updateTimes').then((updateTimes) => {
        const diff = OasysDateTime.timestampDiffString(updateTimes[0][0], updateTimes[0][1])  // ms
        let failed = false
        if (diff > 30000) {  // 30 seconds - allows time from updating SAN, returning to OASys and updating the db.
            cy.log(`FAILED - SAN update time mismatch in oasys_set- expected: ${updateTimes[0][0]}, updated: ${updateTimes[0][1]}`)
            failed = true
        }
        cy.wrap(failed).as(resultAlias)
    })
}

/**
 * Gets the time for the last API call of the specified type for a given PK, returned using an alias as a Temporal date/time object including milliseconds
 */
export function getSanApiTime(pk: number, type: 'SAN_GET_ASSESSMENT' | 'SAN_CREATE_ASSESSMENT' | 'SAN_LOCK_INCOMPLETE', resultAlias: string) {

    const query = `select to_char(time_stamp, '${OasysDateTime.oracleTimestampFormatMs}') from eor.clog where log_source like '%${pk}%${type}%' order by time_stamp desc`
    oasys.Db.getData(query, 'clogData')
    cy.get<string[][]>('@clogData').then((clogData) => {
        let result: Temporal.PlainDateTime = null
        if (clogData.length > 0) {
            result = OasysDateTime.stringToTimestamp(clogData[0][0])
        }

        cy.wrap(result).as(resultAlias)
    })
}

/**
 * Checks cLog for expected entries following a createAssessment call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
 * (including the 201 status). The test will fail if anything is not as expected. Parameters are:
 *  - pk
 *  - previousPk: should be included for cloning, otherwise null
 *  - expectedUser: OASys User Id for the user creating the assessment
 *  - expected Provider: code for the area/establishment
 *  - expectedPlanType: 'INITIAL' or 'REVIEW'
 *  - expectedVersion: version number that should be returned by SAN
 *  - expectedSpVersion: version number that should be returned by SAN for the Sentence Plan
 */
export function checkSanCreateAssessmentCall(pk: number, previousPk: number, expectedUser: User, expectedProvider: string, expectedPlanType: 'INITIAL' | 'REVIEW') {

    cy.log(`Check CreateAssessment API call for ${pk}, previous ${previousPk}`)
    const query = `select log_text from eor.clog where log_source like '%${pk}%SAN_CREATE%' order by time_stamp desc`
    oasys.Db.getData(query, 'clogData')
    cy.get<string[][]>('@clogData').then((clogData) => {
        let failed = false

        if (clogData.length != 2) {
            cy.log(`Expected 2 rows in CLog, found ${clogData.length}`)
            failed = true
        } else {
            const call = clogData[1][0].split('\n')
            if (call[1].substring(call[1].length - 12) != 'oasys/create') {
                cy.log(`Expected call url to include 'oasys/create', found ${call[1]}`)
                failed = true
            }
            const callData = JSON.parse(call[3].substring(16))
            if (callData['previousOasysSanPk'] != previousPk) {
                cy.log(`Expected previous PK: ${previousPk}, found ${callData['previousOasysSanPk']}`)
                failed = true
            }
            if (callData['regionPrisonCode'] != expectedProvider) {
                cy.log(`Expected provider: ${expectedProvider}, found ${callData['regionPrisonCode']}`)
                failed = true
            }
            if (callData['userDetails']['id'] != expectedUser.username) {
                cy.log(`Expected user ID: ${expectedUser.username}, found ${callData['userDetails']['id']}`)
                failed = true
            }
            if (callData['userDetails']['name'] != expectedUser.forenameSurname) {
                cy.log(`Expected user name: ${expectedUser.forenameSurname}, found ${callData['userDetails']['name']}`)
                failed = true
            }
            if (callData['planType'] != expectedPlanType) {
                cy.log(`Expected sentence plan type: ${expectedPlanType}, found ${callData['planType']}`)
                failed = true
            }

            const response = clogData[0][0].split('\n')
            if (response[2].substring(response[2].length - 3) != '201') {
                cy.log(`Expected 201 response, found ${response[2]} `)
                failed = true
            }
        }

        cy.then(() => {
            if (failed) {
                throw new Error('Error checking Create API call')
            }
        })
    })
}

/**
 * Checks cLog for expected entries following a countersigning call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
 * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
 *  - pk
 *  - expectedUser: OASys User Id for the user countersigning the assessment
 *  - outcome: countersigning action expected - 'COUNTERSIGNED', 'AWAITING_DOUBLE_COUNTERSIGN', 'DOUBLE_COUNTERSIGNED' or 'REJECTED'
 *  - expectedVersion: version number that should be returned by SAN
 *  - expectedSpVersion: version number for the sentence plan that should be returned by SAN
 */
export function checkSanCountersigningCall(pk: number, expectedUser: User, outcome: 'COUNTERSIGNED' | 'AWAITING_DOUBLE_COUNTERSIGN' | 'DOUBLE_COUNTERSIGNED' | 'REJECTED') {

    checkSanCall('Countersigning', 'COUNTERSIGN', 'counter-sign', pk, expectedUser, { outcome: outcome })
}

/**
 * Checks cLog for expected entries following a signing call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
 * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
 *  - pk
 *  - expectedUser: OASys User Id for the user signing the assessment
 *  - signingType: signing action expected - 'SELF' or 'COUNTERSIGN'
 *  - expectedVersion: version number that should be returned by SAN
 *  - expectedSpVersion: version number for the sentence plan that should be returned by SAN
 */
export function checkSanSigningCall(pk: number, expectedUser: User, signingType: 'SELF' | 'COUNTERSIGN') {

    checkSanCall('Signing', 'SIGN', 'sign', pk, expectedUser, { signingType: signingType })
}

/**
 * Checks cLog for expected entries following a lockIncomplete call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
 * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
 *  - pk
 *  - expectedUser: OASys User Id for the user locking the assessment
 *  - expectedVersion: version number that should be returned by SAN
 *  - expectedSpVersion: version number for the sentence plan that should be returned by SAN
 */
export function checkSanLockIncompleteCall(pk: number, expectedUser: User) {

    checkSanCall('Lock Incomplete', 'LOCK_INCOMPLETE', 'lock', pk, expectedUser)
}

/**
 * Checks cLog for expected entries following a delete call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
 * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
 *  - pk
 *  - expectedUser: OASys User Id for the user deleting the assessment
 */
export function checkSanDeleteCall(pk: number, expectedUser: User) {

    checkSanCall('Delete', 'SOFT_DELETE', 'soft-delete', pk, expectedUser)
}

/**
 * Checks cLog for expected entries following an undelete call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
 * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
 *  - pk
 *  - expectedUser: OASys User Id for the user undeleting the assessment
 */
export function checkSanUndeleteCall(pk: number, expectedUser: User) {

    checkSanCall('Undelete', 'UNDELETE', 'undelete', pk, expectedUser)
}

/**
 * Checks cLog for expected entries following a rollback call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
 * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
 *  - pk
 *  - expectedUser: OASys User Id for the user rolling back the assessment
 *  - expectedVersion: version number that should be returned by SAN
 *  - expectedSpVersion: version number for the sentence plan that should be returned by SAN
 */
export function checkSanRollbackCall(pk: number, expectedUser: User) {

    checkSanCall('Rollback', 'ROLLBACK', 'rollback', pk, expectedUser)
}

/**
 * Checks cLog for expected entries following an OTL call to SAN, to confirm that the correct values are passed to SAN and the status 200 response is received.
 * The test will fail if anything is not as expected.
 * 
 * Expected details for the Subject, User and Needs are provided as objects with properties such as the examples shown below; any properties listed will be checked against
 * the parameters generated by OASys and recorded in cLog.
 * 
 *  Parameters are:
 *  - pk
 *  - expectedSubjectDetails: can include crn, pnc, nomisId, givenName, familyName, dateOfBirth, gender, location, sexuallyMotivatedOffenceHistory
 *  - expectedUserDetails: can include displayName, accessMode (READ_ONLY or READ_WRITE)
 *  - callType: 'san' or 'sp'
 *  - version: version number for either SAN or SP as appropriate (can be null)
 *  - expectedNeedsDetails: can include any of the relevant needs data, section by section
 */
export function checkSanOtlCall(pk: number, expectedSubjectDetails: { [keys: string]: string | OasysDate }, expectedUserDetails: { [keys: string]: string },
    callType: 'san' | 'sp', version: number, expectedNeedsDetails?: { [keys: string]: { [keys: string]: string } }) {

    cy.log(`Checking OTL call for ${pk}`)
    if (expectedSubjectDetails['dateOfBirth']) {  // reformat the date
        expectedSubjectDetails['dateOfBirth'] = OasysDateTime.oasysDateAsDbString(expectedSubjectDetails['dateOfBirth'])
    }

    const query = `select log_text from eor.clog where log_source like '%${pk}%onetime%' order by time_stamp desc fetch first 2 rows only`
    oasys.Db.getData(query, 'clogData')
    cy.get<string[][]>('@clogData').then((clogData) => {

        let failed = false
        if (clogData.length != 2) {
            cy.log(`Expected 2 rows in CLog, found ${clogData.length}`)
            failed = true
        } else {
            const call = clogData[1][0].split('\n')
            if (call[1].substring(call[1].length - 8) != 'handover') {
                cy.log(`Expected call url to include 'handover', found ${call[1]}`)
                failed = true
            }
            const callData = JSON.parse(call[3].substring(16))

            Object.keys(expectedSubjectDetails).forEach((key) => {
                if (callData['subjectDetails'][key] != expectedSubjectDetails[key]) {
                    cy.log(`Expected value for ${key}: ${expectedSubjectDetails[key]}, found ${callData['subjectDetails'][key]}`)
                    failed = true
                }
            })
            Object.keys(expectedUserDetails).forEach((key) => {
                if (callData['user'][key] != expectedUserDetails[key]) {
                    cy.log(`Expected value for ${key}: ${expectedUserDetails[key]}, found ${callData['user'][key]}`)
                    failed = true
                }
            })
            if (expectedNeedsDetails) {
                Object.keys(expectedNeedsDetails).forEach((section) => {
                    Object.keys(expectedNeedsDetails[section]).forEach((key) => {
                        if (callData['criminogenicNeedsData'][section][key] != expectedNeedsDetails[section][key]) {
                            cy.log(`Expected value for ${section}/${key}: ${expectedNeedsDetails[section][key]}, found ${callData['criminogenicNeedsData'][section][key]}`)
                            failed = true
                        }
                    })
                })
            }
            const assessmentVersion = callType == 'san' ? version : undefined
            const spVersion = callType == 'sp' ? version : undefined
            if (callData['assessmentVersion'] != assessmentVersion) {
                cy.log(`Expected assessment version: ${assessmentVersion}, found ${callData['assessmentVersion']}`)
                failed = true
            }
            // if (callData['sentencePlanVersion'] != spVersion) {
            //     cy.log(`Expected sentence plan version: ${spVersion}, found ${callData['sentencePlanVersion']}`)
            //     failed = true
            // }  // TODO

            const response = clogData[0][0].split('\n')
            if (response[2].substring(response[2].length - 3) != '200') {
                cy.log(`Expected 200 response, found ${response[2]} `)
                failed = true
            }
        }

        cy.then(() => {
            if (failed) {
                throw new Error('Error checking OTL API call')
            }
        })
    })
}

/**
 * Checks cLog for expected entries following a merge call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
 * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
 *  - expectedUser: OASys User Id for the user rolling back the assessment
 *  - pkPairs: an array of \{ old: number, new: number \}, each pair contains expected values for the old and new assessment PKs.
 */
export function checkSanMergeCall(expectedUser: User, pkPairs: number) {

    cy.log(`Checking Merge call for ${JSON.stringify(pkPairs)}`)
    const query = `select log_text from eor.clog where log_source like '%${expectedUser.username}%SAN_MERGE_DEMERGE_URL%' order by time_stamp desc fetch first 2 rows only`
    oasys.Db.getData(query, 'clogData')
    cy.get<string[][]>('@clogData').then((clogData) => {
        let failed = false

        if (clogData.length != 2) {
            cy.log(`Expected 2 rows in CLog, found ${clogData.length}`)
            failed = true
        } else {
            const call = clogData[1][0].split('\n')
            if (call[1].substring(call[1].length - 11) != `oasys/merge`) {
                cy.log(`Expected call url to include 'oasys/merge', found ${call[1].substring(call[1].length - 11)}`)
                failed = true
            }

            const jsonStart = clogData[1][0].search('p_json') + 16
            const jsonEnd = clogData[1][0].search('p_token') - 1
            const callData = JSON.parse(clogData[1][0].substring(jsonStart, jsonEnd))

            const mergeData = callData['merge']
            mergeData.sort(arraySort)

            if (mergeData.length != pkPairs) {
                cy.log(`Expected ${pkPairs} pairs, found ${mergeData.length}`)
                failed = true
            }

            if (callData['userDetails']['id'] != expectedUser.username) {
                cy.log(`Expected user ID: ${expectedUser.username}, found ${callData['userDetails']['id']}`)
                failed = true
            }
            if (callData['userDetails']['name'] != expectedUser.forenameSurname) {
                cy.log(`Expected user name: ${expectedUser.forenameSurname}, found ${callData['userDetails']['name']}`)
                failed = true
            }

            const response = clogData[0][0].split('\n')
            if (response[2].substring(response[2].length - 3) != '200') {
                cy.log(`Expected 200 response, found ${response[2]} `)
                failed = true
            }
        }

        cy.then(() => {
            if (failed) {
                throw new Error('Error checking Merge API call')
            }
        })
    })
}

/**
 * Checks cLog for a getAssessment call for the given PK, including the expected version number in the respose.
 */
export function checkSanGetAssessmentCall(pk: number, expectedVersion: number) {

    cy.log(`Checking GetAssessment call for ${pk}`)
    const query = `select log_text from eor.clog where log_source like '%${pk}%SAN_GET_ASS%' order by time_stamp desc fetch first 2 rows only`
    oasys.Db.getData(query, 'clogData')
    cy.get<string[][]>('@clogData').then((clogData) => {
        let failed = false

        if (clogData.length != 2) {
            cy.log(`Expected 2 rows in CLog, found ${clogData.length}`)
            failed = true
        } else {
            if (clogData[1][0].search(pk.toString()) < 0) {
                cy.log(`${pk} not found in GetAssessment call`)
                failed = true
            }
            const sanVersionNumber = findSanVersion(clogData[0][0])
            if (sanVersionNumber != expectedVersion) {
                cy.log(`Expected version: ${expectedVersion}, found ${sanVersionNumber}`)
                failed = true
            }
        }

        cy.then(() => {
            if (failed) {
                throw new Error('Error checking GetAssessment API call')
            }
        })
    })
}

/**
 * Confirms that there is nothing in cLog relating to any SAN API calls for the given PK
 */
export function checkNoSanCall(pk: number) {

    const query = `select log_text from eor.clog where log_source like '%${pk}%' and log_text <> 'lv_previous_layer [LAYER3_1] || lv_current_layer [LAYER3_1]'`
    oasys.Db.getData(query, 'clogData')
    cy.get<string[][]>('@clogData').then((clogData) => {
        if (clogData && clogData.length > 0) {
            throw new Error(`Found unexpected clog entries for PK ${pk}`)
        }
    })
}

/**
 * Checks that the expected number of questions has a non-null answer for the given pk and OASys section.  Fails the test if there is a mismatch.
 */
export function checkCountOfQuestionsInSection(pk: number, section: string, expectedCount: number) {
    const sanSectionQuery = `select count(*) from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q, eor.oasys_answer a
                                where st.oasys_set_pk = s.oasys_set_pk
                                and s.oasys_section_pk = q.oasys_section_pk
                                and q.oasys_question_pk = a.oasys_question_pk(+)
                                and s.ref_section_code = '${section}' 
                                and (a.ref_answer_code is not null or q.free_format_answer is not null or q.additional_note is not null)
                                and st.oasys_set_pk = ${pk}`
    oasys.Db.selectCount(sanSectionQuery, 'result')
    cy.get<number>('@result').then((count) => {
        expect(count).equal(expectedCount)
    })
}

/**
 * Gets the SAN update tiem from clog, then checks the SAN update details in oasys_set
 */
export function getSanApiTimeAndCheckDbValues(pk: number, linkedInd: 'Y' | 'N', clonedPk: number) {

    oasys.San.getSanApiTime(pk, 'SAN_GET_ASSESSMENT', 'getSanDataTime')
    cy.get<Temporal.PlainDateTime>('@getSanDataTime').then((sanDataTime) => {
        oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
            SAN_ASSESSMENT_LINKED_IND: linkedInd,
            CLONED_FROM_PREV_OASYS_SAN_PK: clonedPk?.toString() ?? null,
            LASTUPD_FROM_SAN: sanDataTime
        })
    })
}
/**
 * 
 */
export function checkSanLockIncompleteTimestamp(pk: number) {

    oasys.San.getSanApiTime(pk, 'SAN_GET_ASSESSMENT', 'getSanDataTime')
    oasys.San.getSanApiTime(pk, 'SAN_LOCK_INCOMPLETE', 'lockIncompleteTime')
    cy.get<Temporal.PlainDateTime>('@getSanDataTime').then((getSanDataTime) => {
        cy.get<Temporal.PlainDateTime>('@lockIncompleteTime').then((lockIncompleteTime) => {
            expect(oasys.OasysDateTime.timestampDiff(getSanDataTime, lockIncompleteTime)).gt(0)
        })
    })
}

function findSanVersion(data: string): number {

    const vStart = data.search('sanAssessmentVersion') + 22
    let sanVersionNumber = data.substring(vStart, vStart + 4)
    const vEnd = sanVersionNumber.search(',')

    const number = parseInt(sanVersionNumber.substring(0, vEnd))
    return number
}

function findSpVersion(data: string): number {

    const vStart = data.search('sentencePlanVersion') + 21
    let spVersionNumber = data.substring(vStart, vStart + 4)
    const vEnd = spVersionNumber.search('}')
    const number = parseInt(spVersionNumber.substring(0, vEnd))
    return number
}

function checkSanCall(name: string, sourceFilter: string, url: string, pk: number, expectedUser: User,
    otherChecks?: { signingType?: 'SELF' | 'COUNTERSIGN', outcome?: string }) {

    cy.log(`Checking ${name} call for ${pk}`)

    const query = `select log_text from eor.clog where log_source like '%${pk}%SAN_${sourceFilter}%' order by time_stamp desc`
    oasys.Db.getData(query, 'clogData')
    cy.get<string[][]>('@clogData').then((clogData) => {
        let failed = false

        if (clogData.length < 2) {
            cy.log(`Expected 2 rows in CLog per event, found ${clogData.length}`)
            failed = true
        } else {
            const call = clogData[1][0].split('\n')
            const start = 7 + url.length
            if (call[1].substring(call[1].length - (start + pk.toString().length)) != `oasys/${pk}/${url}`) {
                cy.log(`Expected call url to include 'oasys/${pk}/${url}', found ${call[1].substring(call[1].length - (start + pk.toString().length))}`)
                failed = true
            }
            const callData = JSON.parse(call[3].substring(16))
            if (callData['userDetails']['id'] != expectedUser.username) {
                cy.log(`Expected user ID: ${expectedUser.username}, found ${callData['userDetails']['id']}`)
                failed = true
            }
            if (callData['userDetails']['name'] != expectedUser.forenameSurname) {
                cy.log(`Expected user name: ${expectedUser.forenameSurname}, found ${callData['userDetails']['name']}`)
                failed = true
            }
            if (otherChecks?.signingType) {
                if (callData['signType'] != otherChecks.signingType) {
                    cy.log(`Expected signing type: ${otherChecks.signingType}, found ${callData['signType']}`)
                    failed = true
                }
            }
            if (otherChecks?.outcome) {
                if (callData['outcome'] != otherChecks.outcome) {
                    cy.log(`Expected outcome: ${otherChecks.outcome}, found ${callData['outcome']}`)
                    failed = true
                }
            }
            const response = clogData[0][0].split('\n')
            if (response[2].substring(response[2].length - 3) != '200') {
                cy.log(`Expected 200 response, found ${response[2]} `)
                failed = true
            }

        }

        cy.then(() => {
            if (failed) {
                throw new Error(`Error checking ${name} API call`)
            }
        })
    })
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