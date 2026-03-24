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

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            // Create new assessment
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
            oasys.Db.getAllSetPksByPnc(offender.pnc, 'pks')

            cy.get<number[]>('@pks').then((pks) => {
                // Check values in OASYS_SET
                oasys.San.getSanApiTimeAndCheckDbValues(pks[0], 'Y', pks[1])

                // Check Create call
                oasys.San.checkSanCreateAssessmentCall(pks[0], pks[1], oasys.Users.probSanUnappr, oasys.Users.probationSanCode, 'REVIEW')
                oasys.San.checkSanGetAssessmentCall(pks[0], 1)

                // Tweak section 1
                const offendingInformation = new oasys.Pages.Assessment.OffendingInformation().goto()
                offendingInformation.offence.setValue('030')
                offendingInformation.subcode.setValue('01')
                offendingInformation.count.setValue(3)
                offendingInformation.offenceDate.setValue({ months: -2 })
                offendingInformation.sentence.setValue('Fine')
                offendingInformation.sentenceDate.setValue({ months: -1 })

                const predictors = new oasys.Pages.Assessment.Predictors().goto(true)
                predictors.o1_32.setValue(4)
                predictors.o1_40.setValue(1)
                predictors.o1_29.setValue({ months: -1 })
                predictors.o1_30.setValue('No')
                predictors.o1_38.setValue({})
                oasys.Nav.clickButton('Save')
                const rmp = new oasys.Pages.Rosh.RiskManagementPlan().checkIsNotOnMenu()

                // Populate SAN sections, check API calls
                oasys.San.gotoSan()
                oasys.San.checkSanOtlCall(pks[0], {
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
                    'displayName': oasys.Users.probSanUnappr.forenameSurname,
                    'accessMode': 'READ_WRITE',
                },
                    'san', null
                )

                // Modify SAN, these changes will trigger FA in this assessment
                oasys.San.populateSanSections('TestRef38 modify SAN', testData.modifySan)
                oasys.San.returnToOASys()
                oasys.Nav.clickButton('Next')
                rmp.checkMenuVisibility(true)
                oasys.San.checkSanGetAssessmentCall(pks[0], 1)

                oasys.logout()
                // Delete the WIP assessment
                oasys.login(oasys.Users.admin, oasys.Users.probationSan)
                oasys.Offender.searchAndSelectByPnc(offender.pnc)
                oasys.Assessment.deleteLatest()
                oasys.San.checkSanDeleteCall(pks[0], oasys.Users.admin)
                oasys.logout()

            })
        })
    })

})
