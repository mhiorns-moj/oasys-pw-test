import * as oasys from 'lib'
import { mappingTestOffenderFile } from './xMappingTest'

type TextType = 'normal' | 'max' | 'empty'
type Motivation = 'noMotivation' | 'someMotivation' | 'motivated' | 'unknown'
type TestCase = {
    ref: number, strengths: boolean, riskOfHarm: boolean, riskOfReoffending: boolean,
    strengthsText: TextType, riskOfHarmText: TextType, riskOfReoffendingText: TextType,
    motivated: Motivation
}

const drugs1 = new oasys.Pages.San.Drugs.Drugs1()
const drugs2 = new oasys.Pages.San.Drugs.Drugs2()
const drugs3 = new oasys.Pages.San.Drugs.Drugs3()
const drugs4 = new oasys.Pages.San.Drugs.Drugs4()
const infoSummary = new oasys.Pages.San.InformationSummary()
const drugsAnalysis = new oasys.Pages.San.Drugs.DrugsPractitionerAnalysis()

describe('Mapping test for drugs practitioner analysis', () => {

    it('Drugs', () => { paTest() })
})

function paTest() {

    cy.readFile(mappingTestOffenderFile).then((offenderDetails) => {
        // Get offender details (run aaSanMappingTestOffender if required to create the offender)
        const mappingTestOffender = JSON.parse(offenderDetails) as OffenderDef

        // Delete previous assessments so no data gets cloned
        oasys.login(oasys.users.admin, oasys.users.probationSan)
        await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
        oasys.Assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
        oasys.logout()

        // Create a new SAN assessment
        oasys.login(oasys.users.probSanUnappr)
        await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

        oasys.Db.getLatestSetPkByPnc(mappingTestOffender.pnc, 'assessmentPk')
        cy.get<number>('@assessmentPk').then((assessmentPk) => {

            cy.wrap(false).as('failed')
            const testCases: TestCase[] =
                [
                    { ref: 1, strengths: true, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal', motivated: null },
                    { ref: 2, strengths: false, riskOfHarm: true, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal', motivated: 'motivated' },
                    { ref: 3, strengths: false, riskOfHarm: false, riskOfReoffending: true, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal', motivated: 'someMotivation' },
                    { ref: 4, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal', motivated: 'noMotivation' },
                    { ref: 5, strengths: true, riskOfHarm: true, riskOfReoffending: true, strengthsText: 'max', riskOfHarmText: 'max', riskOfReoffendingText: 'max', motivated: 'unknown' },
                    { ref: 6, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'empty', riskOfHarmText: 'empty', riskOfReoffendingText: 'empty', motivated: 'motivated' },
                    { ref: 7, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'empty', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal', motivated: 'someMotivation' },
                    { ref: 8, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'empty', riskOfReoffendingText: 'normal', motivated: 'noMotivation' },
                    { ref: 9, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'empty', motivated: 'unknown' },
                ]

            for (const test of testCases) {

                // Get to the right starting screen

                if (test.ref == 1) {
                    await san.gotoSan('Drug use', 'information', true)
                    drugs1.everUsed.setValue('yes')  // Need to set this otherwise the motivation question doesn't get returned
                    // new oasys.Pages.San.SectionLandingPage('Drug use').analysis.click()  Removed for navigation change in release 1.11, might come back later
                    drugs1.saveAndContinue.click()
                    drugs2.drugType.setValue(['cannabis'])
                    drugs2.cannabisLastSixMonths.setValue('no')
                    drugs2.saveAndContinue.click()
                    drugs3.detailsNotLastSixMonths.setValue('details')
                    drugs3.treatment.setValue('no')
                    drugs3.saveAndContinue.click()
                    drugs4.whyStarted.setValue(['cultural'])
                    drugs4.impactDrugs.setValue(['behavioural'])
                    drugs4.wantChanges.setValue('madeChanges')
                    drugs4.saveAndContinue.click()
                    infoSummary.analysis.click()
                } else {
                    await san.gotoSan('Drug use', 'analysis', true)
                    infoSummary.analysis.click()
                    if (test.ref > 2) {
                        drugsAnalysis.change.click()
                    }
                }

                // Set values on SAN, return to OASys and check the results
                scenario(test)
                await san.returnToOASys()
                await oasys.clickButton('Previous', true)
                await oasys.clickButton('Next', true)

                const failedAlias = `ref${test.ref}Alias`
                cy.groupedLogStart(JSON.stringify(test)).then(() => {  // Force Cypress to wait before running the next bit
                    checkAnswers(assessmentPk, test, failedAlias)
                    cy.get<boolean>(`@${failedAlias}`).then((scenarioFailed) => {
                        if (scenarioFailed) {
                            cy.wrap(true).as('failed')
                        } else {
                            cy.groupedLog('Passed')
                        }
                        cy.task('consoleLog', `Ref ${test.ref} ${scenarioFailed ? 'FAILED' : 'Passed'}`)
                    }).then(() => {
                        cy.groupedLogEnd()
                    })
                })
            }

            cy.get<boolean>('@failed').then((failed) => {
                expect(failed).to.be.false
            })
        })
    })
}

function scenario(test: TestCase) {

    drugsAnalysis.motivatedToStop.setValue(test.motivated)
    setValues('strengths', test)
    setValues('riskOfHarm', test)
    setValues('riskOfReoffending', test)
    drugsAnalysis.saveAndContinue.click()
}

function setValues(question: 'strengths' | 'riskOfHarm' | 'riskOfReoffending', test: TestCase) {

    if (test[question]) {
        drugsAnalysis[question].setValue('yes')
        drugsAnalysis[`${question}YesDetails`].setValue(getText(question, true, test[`${question}Text`]))
    } else {
        drugsAnalysis[question].setValue('no')
        drugsAnalysis[`${question}NoDetails`].setValue(getText(question, false, test[`${question}Text`]))
    }
}

function getText(question: 'strengths' | 'riskOfHarm' | 'riskOfReoffending', yes: boolean, textType: 'normal' | 'max' | 'empty'): string {

    switch (textType) {
        case 'normal':
            return `${question} text - ${yes ? 'yes' : 'no'} selected`
        case 'max':
            return oasys.oasysString(question == 'riskOfReoffending' ? 1000 : 1425)
        case 'empty':
            return ''
    }
}

function checkAnswers(assessmentPk: number, test: TestCase, resultAlias: string) {

    /*
        8.8: motivation - 0/1/2/M
        8.97: combined text
            if riskOfHarm
                'Area linked to serious harm notes - ' + relevant text + newline
            else
                'Area not linked to serious harm notes - ' + relevant text + newline

            if strengths
                'Strengths and protective factor notes - ' + relevant text + newline
            else
                'Area not linked to strengths and positive factors notes - ' + relevant text + newline

            if riskOfReoffending
                'Risk of reoffending notes - ' + relevant text
            else
                'Area not linked to reoffending notes - ' + relevant text

        8.98: risk of harm - YES or NO
        8.99: risk of reoffending - YES or NO
        8_SAN_STRENGTH: strenthgs - YES or NO
        SMD_SAN_SECTION_COMP: section complete - YES or NO
    */

    const motivation = test.motivated == 'motivated' ? '0'
        : test.motivated == 'someMotivation' ? '1'
            : test.motivated == 'noMotivation' ? '2'
                : test.motivated == 'unknown' ? 'M' : null

    let text: string = null
    if (test.strengthsText != 'empty' || test.riskOfHarmText != 'empty' || test.riskOfReoffendingText != 'empty') {
        let strengthsText = answerText('strengths', test)
        let riskOfHarmText = answerText('riskOfHarm', test)
        const riskOfReoffendingText = answerText('riskOfReoffending', test)

        if (strengthsText != '' && `${riskOfHarmText}${riskOfReoffendingText}` != '') {
            strengthsText = `${strengthsText}\n`
        }
        if (riskOfHarmText != '' && riskOfReoffendingText != '') {
            riskOfHarmText = `${riskOfHarmText}\n`
        }
        text = `${strengthsText}${riskOfHarmText}${riskOfReoffendingText}`
    }
    /*
    
        If riskSeriousHarmText <> "" And riskReoffendingText <> "" Then
            riskSeriousHarmText = riskSeriousHarmText & vbNewLine
        End If
        
        x_97 = strengthsText & riskSeriousHarmText & riskReoffendingText
        If x_97 = "" Then x_97 = "null"
    */

    const expectedAnswers: OasysAnswer[] = [
        { section: '8', q: '8.8', a: motivation },
        { section: '8', q: '8.97', a: text },
        { section: '8', q: '8.98', a: test.riskOfHarm == null ? null : test.riskOfHarm ? 'YES' : 'NO' },
        { section: '8', q: '8.99', a: test.riskOfReoffending == null ? null : test.riskOfReoffending ? 'YES' : 'NO' },
        { section: '8', q: '8_SAN_STRENGTH', a: test.strengths == null ? null : test.strengths ? 'YES' : 'NO' },
    ]

    cy.task('checkSectionAnswers', { assessmentPk: assessmentPk, section: '8', expectedAnswers: expectedAnswers }).then((result: CheckDbSectionResponse) => {

        result.report.forEach((line) => {
            if (line.includes('FAILED')) {
                cy.groupedLog(line)
            }
        })
        cy.wrap(result.failed).as(resultAlias)
    })
}

function answerText(question: 'strengths' | 'riskOfHarm' | 'riskOfReoffending', test: TestCase): string {

    const yesPrefix = {
        strengths: 'Strengths and protective factor notes - ',
        riskOfHarm: 'Area linked to serious harm notes - ',
        riskOfReoffending: 'Risk of reoffending notes - ',
    }
    const noPrefix = {
        strengths: 'Area not linked to strengths and positive factors notes - ',
        riskOfHarm: 'Area not linked to serious harm notes - ',
        riskOfReoffending: 'Area not linked to reoffending notes - ',
    }

    return test[`${question}Text`] == 'empty'
        ? ''
        : `${test[question]
            ? yesPrefix[question]
            : noPrefix[question]}${getText(question, test[question], test[`${question}Text`])}`
}