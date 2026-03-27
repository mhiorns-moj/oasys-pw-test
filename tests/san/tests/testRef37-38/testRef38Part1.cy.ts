import * as oasys from 'oasys'
import * as testData from '../../data/testRef38'

describe('SAN integration - test ref 38 part 1', () => {
    /**
     * Have a completed 3.2 assessment that has been countersigned.
     * Create a new 3.2 assessment and enter some data including SAN data.
     * Delete that second 3.2 assessment. 
     * Roll back the first 3.2 assessment and carry on with that does it work with SAN statuses?
     */

    it('Create 3.2 assessment and change some data, then delete it', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            await oasys.login(oasys.users.probSanUnappr)
            await offender.searchAndSelectByPnc(offender.pnc)

            // Create new assessment
            await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
            oasys.Db.getAllSetPksByPnc(offender.pnc, 'pks')

            cy.get<number[]>('@pks').then((pks) => {
                // Check values in OASYS_SET
                await san.queries.getSanApiTimeAndCheckDbValues(pks[0], 'Y', pks[1])

                // Check Create call
                await san.queries.checkSanCreateAssessmentCall(pks[0], pks[1], oasys.users.probSanUnappr, oasys.users.probationSanCode, 'REVIEW')
                await san.queries.checkSanGetAssessmentCall(pks[0], 1)

                // Tweak section 1
                await sections.offendingInformation.goto()
                offendingInformation.offence.setValue('030')
                offendingInformation.subcode.setValue('01')
                offendingInformation.count.setValue(3)
                offendingInformation.offenceDate.setValue({ months: -2 })
                offendingInformation.sentence.setValue('Fine')
                offendingInformation.sentenceDate.setValue({ months: -1 })

                await sections.predictors.goto(true)
                await sections.predictors.o1_32.setValue(4)
                await sections.predictors.o1_40.setValue(1)
                await sections.predictors.o1_29.setValue({ months: -1 })
                await sections.predictors.o1_30.setValue('No')
                await sections.predictors.o1_38.setValue({})
                await oasys.clickButton('Save')
                const rmp = new oasys.Pages.Rosh.RiskManagementPlan().checkIsNotOnMenu()

                // Populate SAN sections, check API calls
                await san.gotoSan()
                await san.queries.checkSanOtlCall(pks[0], {
                    'crn': offender.probationCrn,
                    'pnc': offender.pnc,
                    'nomisId': null,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '1',
                    'location': 'COMMUNITY',
                    'sexuallyMotivatedOffenceHistory': 'NO',
                }, {
                    'displayName': oasys.users.probSanUnappr.forenameSurname,
                    'accessMode': 'READ_WRITE',
                },
                    'san', null
                )

                // Modify SAN, these changes will trigger FA in this assessment
                await san.populateSanSections('TestRef38 modify SAN', testData.modifySan)
                await san.returnToOASys()
                await oasys.clickButton('Next')
                rmp.checkMenuVisibility(true)
                await san.queries.checkSanGetAssessmentCall(pks[0], 1)

                await oasys.logout()
                // Delete the WIP assessment
                await oasys.login(oasys.users.admin, oasys.users.probationSan)
                await offender.searchAndSelectByPnc(offender.pnc)
                await assessment.deleteLatest()
                await san.queries.checkSanDeleteCall(pks[0], oasys.users.admin)
                await oasys.logout()

            })
        })
    })

})
