import { mappingTestOffenderFile } from './xMappingTest'

const accommodation1 = new oasys.Pages.San.Accommodation.Accommodation1()
const accommodation2 = new oasys.Pages.San.Accommodation.Accommodation2()
const relationshipsLanding = new oasys.Pages.San.SectionLandingPage('Personal relationships and community')
const relationships1 = new oasys.Pages.San.Relationships.Relationships1()
const relationships2 = new oasys.Pages.San.Relationships.Relationships2()

type AccommodationOptions = 'family' | 'friends' | 'partner' | 'child' | 'other' | 'unknown' | 'alone'
type RelationshipOptions = 'partner' | 'ownChildren' | 'otherChildren' | 'family' | 'friends' | 'other'

describe('Mapping test for question 6.8', () => {

    test('Mapping test for question 6.8', () => {

        /*
        Who is [subject] living with?
            If living_with contains 'PARTNER' then
                6-8 = 1
            else if 'Who are the important people in [subject]'s life?' = 'PARTNER_INTIMATE_RELATIONSHIP' Then
                6-8 = 2
            else
                6-8 = 3
            End If
        */

        // Occasional error in SAN 'Cannot read properties of null (reading 'postMessage')'.  Need to workaround it with the following:
        Cypress.on('uncaught:exception', () => {
            return false
        })

        const logText: string[] = []
        cy.wrap(false).as('failed')

        cy.readFile(mappingTestOffenderFile).then((offenderDetails) => {
            const mappingTestOffender = JSON.parse(offenderDetails) as OffenderDef

            await oasys.login(oasys.users.admin, oasys.users.probationSan)
            await offender.searchAndSelectByCrn(mappingTestoffender1.probationCrn)
            oasys.Assessment.deleteAll(mappingTestoffender1.surname, mappingTestoffender1.forename1)
            await oasys.logout()

            await oasys.login(oasys.users.probSanUnappr)
            await offender.searchAndSelectByCrn(mappingTestoffender1.probationCrn)
            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

            await oasysDb.getLatestSetPkByPnc(mappingTestoffender1.pnc, 'assessmentPk')
            cy.get<number>('@assessmentPk').then((assessmentPk) => {
                const testCases: { accommodation: AccommodationOptions[], relationship: RelationshipOptions[], mapping: number }[] =
                    [
                        { accommodation: [], relationship: [], mapping: 3 },
                        { accommodation: ['alone'], relationship: [], mapping: 3 },
                        { accommodation: [], relationship: ['other'], mapping: 3 },
                        { accommodation: [], relationship: ['partner'], mapping: 2 },
                        { accommodation: ['partner'], relationship: [], mapping: 1 }, //5
                        { accommodation: ['child'], relationship: ['other'], mapping: 3 },
                        { accommodation: ['family'], relationship: ['other'], mapping: 3 },
                        { accommodation: ['friends'], relationship: ['other'], mapping: 3 },
                        { accommodation: ['other'], relationship: ['other'], mapping: 3 },
                        { accommodation: ['partner'], relationship: ['other'], mapping: 1 }, // 10
                        { accommodation: ['unknown'], relationship: ['other'], mapping: 3 },
                        { accommodation: ['child', 'partner'], relationship: ['other'], mapping: 1 },
                        { accommodation: ['family', 'partner'], relationship: ['other'], mapping: 1 },
                        { accommodation: ['friends', 'partner'], relationship: ['other'], mapping: 1 },
                        { accommodation: ['other', 'partner'], relationship: ['other'], mapping: 1 }, // 15
                        { accommodation: ['unknown', 'partner'], relationship: ['other'], mapping: 1 },
                        { accommodation: ['alone'], relationship: ['family'], mapping: 3 },
                        { accommodation: ['alone'], relationship: ['friends'], mapping: 3 },
                        { accommodation: ['alone'], relationship: ['other'], mapping: 3 },
                        { accommodation: ['alone'], relationship: ['otherChildren'], mapping: 3 }, // 20
                        { accommodation: ['alone'], relationship: ['ownChildren'], mapping: 3 },
                        { accommodation: ['alone'], relationship: ['partner'], mapping: 2 },
                        { accommodation: ['alone'], relationship: ['family', 'partner'], mapping: 2 },
                        { accommodation: ['alone'], relationship: ['friends', 'partner'], mapping: 2 },
                        { accommodation: ['alone'], relationship: ['other', 'partner'], mapping: 2 }, // 25
                        { accommodation: ['alone'], relationship: ['otherChildren', 'partner'], mapping: 2 },
                        { accommodation: ['alone'], relationship: ['ownChildren', 'partner'], mapping: 2 },
                        { accommodation: ['child', 'partner'], relationship: ['family', 'partner'], mapping: 1 },
                        { accommodation: ['family', 'partner'], relationship: ['friends', 'partner'], mapping: 1 },
                        { accommodation: ['other', 'partner'], relationship: ['other', 'partner'], mapping: 1 }, // 30
                        { accommodation: ['alone'], relationship: ['otherChildren', 'partner'], mapping: 2 },
                        { accommodation: ['unknown', 'partner'], relationship: ['ownChildren', 'partner'], mapping: 1 },
                    ]

                let first = true
                let i = 1
                for (const test of testCases) {
                    console.log(`Test case ${i}`)
                    if (first) {
                        // Extra case 0 without any accommodation
                        await san.gotoSan('Accommodation', 'information', true)
                        accommodation1.currentAccommodation.setValue('noAccommodation')

                        setRelationshipOptions(['partner'], true)
                        checkMapping(assessmentPk, 2, logText, 0)
                    }
                    await san.gotoSan('Accommodation', 'information', true)
                    setAccommodationOptions(test.accommodation, first)
                    setRelationshipOptions(test.relationship, false)
                    logText.push(`${i}: ${JSON.stringify(test)}`)
                    checkMapping(assessmentPk, test.mapping, logText, i)
                    first = false
                    i++
                }


                cy.get<boolean>('@failed').then((failed) => {
                    cy.groupedLogStart('Test case details:')
                    logText.forEach((line) => { cy.groupedLog(line) })
                    cy.groupedLogEnd().then(() => {
                        await oasys.logout()
                        expect(failed).to.be.false
                    })
                })
            })
        })
    })
})

function setAccommodationOptions(options: AccommodationOptions[], firstRun: boolean) {

    if (firstRun) {
        accommodation1.currentAccommodation.setValue('settled')
        accommodation1.settledAccommodationType.setValue('homeowner')
    }
    accommodation1.saveAndContinue.click()
    accommodation2.livingWith.setValue(options)
}

function setRelationshipOptions(options: RelationshipOptions[], firstRun: boolean) {

    relationshipsLanding.goto(true)
    // relationshipsLanding.information.click()  Removed for ARNS release 1.11, might come back later
    if (firstRun) {
        relationships1.anyChildren.setValue(['no'])
        relationships1.saveAndContinue.click()
    }
    relationships2.importantPeople.setValue(options)
}

function checkMapping(assessmentPk: number, expectedValue: number, logText: string[], testCase: number) {

    await san.returnToOASys()
    await oasys.clickButton('Previous', true)
    await oasys.clickButton('Next', true)

    await oasysDb.checkSingleAnswer(assessmentPk, '6', '6.8', 'refAnswer', expectedValue == null ? null : expectedValue.toString(), 'failed', logText, testCase)
}