import { mappingTestOffenderFile } from './xMappingTest'

type TestCase = { ref: number, lastSix: boolean, frequency: DrugsFrequency, injectedLastSix: boolean, injectedMoreThanSix: boolean }

const drugs1 = new oasys.Pages.San.Drugs.Drugs1()
const drugs2 = new oasys.Pages.San.Drugs.Drugs2()
const drugs3 = new oasys.Pages.San.Drugs.Drugs3()

// Template response data for these tests
const expectedAnswersTemplate: OasysAnswer[] = [
    { section: '8', q: '8.1', a: 'YES' },
    { section: '8', q: '8.2.8.1', a: null },
    { section: '8', q: '8.2.8.2', a: null },
    { section: '8', q: '8.2.8.3', a: null },
    { section: '8', q: '8.2.8.4', a: null },
    { section: '8', q: '8.2.7.1', a: null },
    { section: '8', q: '8.2.7.2', a: null },
    { section: '8', q: '8.2.7.3', a: null },
    { section: '8', q: '8.2.7.4', a: null },
    { section: '8', q: '8.2.11.1', a: null },
    { section: '8', q: '8.2.11.3', a: null },
    { section: '8', q: '8.2.5.1', a: null },
    { section: '8', q: '8.2.5.2', a: null },
    { section: '8', q: '8.2.5.3', a: null },
    { section: '8', q: '8.2.5.4', a: null },
    { section: '8', q: '8.2.4.1', a: null },
    { section: '8', q: '8.2.4.2', a: null },
    { section: '8', q: '8.2.4.3', a: null },
    { section: '8', q: '8.2.4.4', a: null },
    { section: '8', q: '8.2.10.1', a: null },
    { section: '8', q: '8.2.10.3', a: null },
    { section: '8', q: '8.2.9.1', a: null },
    { section: '8', q: '8.2.9.3', a: null },
    { section: '8', q: '8.2.1.1', a: null },
    { section: '8', q: '8.2.1.2', a: null },
    { section: '8', q: '8.2.1.3', a: null },
    { section: '8', q: '8.2.1.4', a: null },
    { section: '8', q: '8.2.2.1', a: null },
    { section: '8', q: '8.2.2.2', a: null },
    { section: '8', q: '8.2.2.3', a: null },
    { section: '8', q: '8.2.2.4', a: null },
    { section: '8', q: '8.2.6.1', a: null },
    { section: '8', q: '8.2.6.2', a: null },
    { section: '8', q: '8.2.6.3', a: null },
    { section: '8', q: '8.2.6.4', a: null },
    { section: '8', q: '8.2.3.1', a: null },
    { section: '8', q: '8.2.3.2', a: null },
    { section: '8', q: '8.2.3.3', a: null },
    { section: '8', q: '8.2.3.4', a: null },
    { section: '8', q: '8.2.12.1', a: null },
    { section: '8', q: '8.2.12.3', a: null },
    { section: '8', q: '8.2.13.1', a: null },
    { section: '8', q: '8.2.13.2', a: null },
    { section: '8', q: '8.2.13.3', a: null },
    { section: '8', q: '8.2.13.4', a: null },
    { section: '8', q: '8.2.15.1', a: null },
    { section: '8', q: '8.2.15.3', a: null },
    { section: '8', q: '8.2.14.1', a: null },
    { section: '8', q: '8.2.14.2', a: null },
    { section: '8', q: '8.2.14.3', a: null },
    { section: '8', q: '8.2.14.4', a: null },
    { section: '8', q: '8.2.14.t', a: null },
    { section: '8', q: '8.4', a: '0' },
    { section: '8', q: '8.5', a: '0' },
    { section: '8', q: '8.6', a: '0' },
]
let expectedAnswers: OasysAnswer[]  // variable to hold a new copy of the template for each iteration of the test with the different drug types
const otherDrugName = 'Other drug name'

describe('Mapping test for drugs - individual drugs details', () => {

    it('amphetamines', () => { drugTest('amphetamines') })
    it('benzodiazepines', () => { drugTest('benzodiazepines') })
    it('cannabis', () => { drugTest('cannabis') })
    it('cocaine', () => { drugTest('cocaine') })
    it('crack', () => { drugTest('crack') })
    it('ecstasy', () => { drugTest('ecstasy') })
    it('hallucinogenics', () => { drugTest('hallucinogenics') })
    it('heroin', () => { drugTest('heroin') })
    it('methadone', () => { drugTest('methadone') })
    it('prescribed', () => { drugTest('prescribed') })
    it('opiates', () => { drugTest('opiates') })
    it('solvents', () => { drugTest('solvents') })
    it('spice', () => { drugTest('spice') })
    it('steroids', () => { drugTest('steroids') })
    it('other', () => { drugTest('other') })

})

function drugTest(drugType: DrugType) {

    // Occasional error in SAN 'Cannot read properties of null (reading 'postMessage')'.  Need to workaround it with the following:
    Cypress.on('uncaught:exception', () => {
        return false
    })

    cy.readFile(mappingTestOffenderFile).then((offenderDetails) => {
        // Get offender details (run aaSanMappingTestOffender if required to create the offender)
        const mappingTestOffender = JSON.parse(offenderDetails) as OffenderDef

        // Delete previous assessments so no data gets cloned
        await oasys.login(oasys.users.admin, oasys.users.probationSan)
        await offender.searchAndSelectByCrn(mappingTestoffender1.probationCrn)
        oasys.Assessment.deleteAll(mappingTestoffender1.surname, mappingTestoffender1.forename1)
        await oasys.logout()

        // Create a new SAN assessment
        await oasys.login(oasys.users.probSanUnappr)
        await offender.searchAndSelectByCrn(mappingTestoffender1.probationCrn)
        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

        await oasysDb.getLatestSetPkByPnc(mappingTestoffender1.pnc, 'assessmentPk')
        cy.get<number>('@assessmentPk').then((assessmentPk) => {

            // Run all the scenarios for a single drug
            cy.wrap(false).as('failed')
            const testCases: TestCase[] =
                [
                    { ref: 1, lastSix: false, frequency: null, injectedLastSix: null, injectedMoreThanSix: null },
                    { ref: 2, lastSix: true, frequency: null, injectedLastSix: null, injectedMoreThanSix: null },
                    { ref: 3, lastSix: true, frequency: 'daily', injectedLastSix: null, injectedMoreThanSix: null },
                    { ref: 4, lastSix: true, frequency: 'weekly', injectedLastSix: null, injectedMoreThanSix: null },
                    { ref: 5, lastSix: true, frequency: 'monthly', injectedLastSix: null, injectedMoreThanSix: null },
                    { ref: 6, lastSix: true, frequency: 'occasionally', injectedLastSix: null, injectedMoreThanSix: null },
                    { ref: 7, lastSix: false, frequency: null, injectedLastSix: null, injectedMoreThanSix: true },
                    { ref: 8, lastSix: true, frequency: 'daily', injectedLastSix: true, injectedMoreThanSix: null },
                    { ref: 9, lastSix: true, frequency: 'weekly', injectedLastSix: true, injectedMoreThanSix: null },
                    { ref: 10, lastSix: true, frequency: 'monthly', injectedLastSix: true, injectedMoreThanSix: null },
                    { ref: 11, lastSix: true, frequency: 'occasionally', injectedLastSix: true, injectedMoreThanSix: null },
                    { ref: 12, lastSix: true, frequency: 'daily', injectedLastSix: false, injectedMoreThanSix: true },
                    { ref: 13, lastSix: true, frequency: 'weekly', injectedLastSix: false, injectedMoreThanSix: true },
                    { ref: 14, lastSix: true, frequency: 'monthly', injectedLastSix: false, injectedMoreThanSix: true },
                    { ref: 15, lastSix: true, frequency: 'occasionally', injectedLastSix: false, injectedMoreThanSix: true },
                    { ref: 16, lastSix: true, frequency: 'daily', injectedLastSix: true, injectedMoreThanSix: true },
                    { ref: 17, lastSix: true, frequency: 'weekly', injectedLastSix: true, injectedMoreThanSix: true },
                    { ref: 18, lastSix: true, frequency: 'monthly', injectedLastSix: true, injectedMoreThanSix: true },
                    { ref: 19, lastSix: true, frequency: 'occasionally', injectedLastSix: true, injectedMoreThanSix: true },
                ]

            let firstRun = true
            cy.task('consoleLog', `Testing ${drugType}`)

            expectedAnswers = JSON.parse(JSON.stringify(expectedAnswersTemplate)) as OasysAnswer[]  // take a copy to modify for this drug
            for (const test of testCases) {
                if (injectableDrug(drugType) || (test.injectedLastSix == null && test.injectedMoreThanSix == null)) {  // skip injection tests for non-injectable drugs
                    // Get to the right starting screen
                    await san.gotoSan('Drug use', 'information', true)
                    if (firstRun) {
                        drugs1.everUsed.setValue('yes')
                        drugs1.saveAndContinue.click()
                    } else {
                        drugs3.previous.click()
                    }
                    // Set values on SAN, return to OASys and check the results
                    scenario(drugType, test)
                    await san.returnToOASys()
                    await oasys.clickButton('Previous', true)
                    await oasys.clickButton('Next', true)

                    const failedAlias = `ref${test.ref}Alias`
                    cy.groupedLogStart(JSON.stringify(test)).then(() => {  // Force Cypress to wait before running the next bit
                        checkAnswers(assessmentPk, drugType, test, failedAlias)
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
                    firstRun = false
                }
            }

            cy.get<boolean>('@failed').then((failed) => {
                expect(failed).to.be.false
            })
        })
    })
}

function scenario(drugType: DrugType, test: TestCase) {

    drugs2.drugType.setValue([drugType])
    if (drugType == 'other') {
        drugs2.drugTypeOther.setValue(otherDrugName)
    }
    drugs2[`${drugType}LastSixMonths`].setValue(test.lastSix ? 'yes' : 'no')
    drugs2.saveAndContinue.click()
    if (test.lastSix && test.frequency != null) {
        drugs3[`${drugType}Frequency`].setValue(test.frequency)
    }
    if (injectableDrug(drugType)) {
        if (test.injectedLastSix == null && test.injectedMoreThanSix == null) {
            drugs3.injected.setValue(['none'])
        } else {
            drugs3.injected.setValue([drugType as InjectableDrugType])
            if (test.lastSix) {
                const injectedValues: ('lastSix' | 'moreThanSix')[] = []
                if (test.injectedLastSix) injectedValues.push('lastSix')
                if (test.injectedMoreThanSix) injectedValues.push('moreThanSix')
                drugs3[`${drugType}InjectedLastSixMonths`].setValue(injectedValues)
            }
        }
    }
}

function checkAnswers(assessmentPk: number, drugType: DrugType, test: TestCase, resultAlias: string) {

    /*
        8.2.x.1 = current frequency - 100/110/120/130
        8.2.x.2 = currently injected - YES or null
        8.2.x.3 = previous usage - YES or null
        8.2.x.4 = previously injected - YES or null

        8.4 = current class A usage (heroin, methadone, opiates, crack, cocaine, prescribed) - 2 or 0
        8.5 = main drug level of use - 2 (daily, weekly), 0 (monthly, occasionally, or not used in last 6 months), M (last six but no frequency)
        8.6 = ever injected - 2 (injected last 6 months), 1 (injected previously), 0
    */

    const drugNumber = drugNumbers[drugType]  // OASys database reference number 8.2.x.
    const dailyOrWeekly = ['daily', 'weekly'].includes(test.frequency)
    const monthlyOrOccasionally = ['monthly', 'occasionally'].includes(test.frequency)

    expectedAnswers.filter((a) => a.q == `8.2.${drugNumber}.1`)[0].a = test.frequency == null ? null : frequencyScore[test.frequency]
    expectedAnswers.filter((a) => a.q == `8.2.${drugNumber}.3`)[0].a = test.lastSix ? null : 'YES'
    if (injectableDrug(drugType)) {
        expectedAnswers.filter((a) => a.q == `8.2.${drugNumber}.2`)[0].a = test.injectedLastSix ? 'YES' : null
        expectedAnswers.filter((a) => a.q == `8.2.${drugNumber}.4`)[0].a = test.injectedMoreThanSix ? 'YES' : null
    }
    if (drugType == 'other') {
        expectedAnswers.filter((a) => a.q == '8.2.14.t')[0].a = otherDrugName
    }
    expectedAnswers.filter((a) => a.q == '8.4')[0].a = drugNumber <= 6 && (dailyOrWeekly || monthlyOrOccasionally) ? '2' : '0'  // drugNumbers 1 to 6 are class A
    expectedAnswers.filter((a) => a.q == '8.5')[0].a = dailyOrWeekly ? '2' : monthlyOrOccasionally ? '0' : !test.lastSix ? '0' : 'M'
    expectedAnswers.filter((a) => a.q == '8.6')[0].a = test.injectedLastSix ? '2' : test.injectedMoreThanSix ? '1' : '0'

    cy.task('checkSectionAnswers', { assessmentPk: assessmentPk, section: '8', expectedAnswers: expectedAnswers }).then((result: CheckDbSectionResponse) => {

        result.report.forEach((line) => {
            if (line.includes('FAILED')) {
                cy.groupedLog(line)
            }
        })
        cy.wrap(result.failed).as(resultAlias)
    })
}

function injectableDrug(drugType: DrugType): boolean {

    return ['amphetamines', 'benzodiazepines', 'cocaine', 'crack', 'heroin', 'methadone', 'prescribed', 'opiates', 'steroids', 'other'].includes(drugType)
}

const frequencyScore = {
    daily: '100',
    weekly: '110',
    monthly: '120',
    occasionally: '130',
}

const drugNumbers = {
    amphetamines: 8,
    benzodiazepines: 7,
    cannabis: 11,
    cocaine: 5,
    crack: 4,
    ecstasy: 10,
    hallucinogenics: 9,
    heroin: 1,
    methadone: 2,
    prescribed: 6,
    opiates: 3,
    solvents: 12,
    spice: 15,
    steroids: 13,
    other: 14,
}
