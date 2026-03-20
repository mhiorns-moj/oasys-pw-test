import * as oasys from 'oasys'
import * as testData from '../../data/testRef38'

describe('SAN integration - test ref 38 part 3', () => {
    /**
     * Have a completed 3.2 assessment that has been countersigned.
     * Create a new 3.2 assessment and enter some data including SAN data.
     * Delete that second 3.2 assessment. 
     * Roll back the first 3.2 assessment and carry on with that does it work with SAN statuses?
     */

    it('Modify and sign again', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)


            oasys.Db.getAllSetPksByPnc(offender.pnc, '[pks]')
            cy.get<number[]>('@[pks]').then((pks) => {  // [0] = the second deleted assessment, [1] = the first one that will be rolled back

                // Open the assessment and check status
                oasys.login(oasys.Users.probSanUnappr)
                oasys.Offender.searchAndSelectByPnc(offender.pnc)
                oasys.Assessment.openLatest()

                const rmp = new oasys.Pages.Rosh.RiskManagementPlan()
                rmp.checkIsNotOnMenu()  // Shouldn't be there

                // Check it's now read-write
                oasys.San.gotoSan('Accommodation','information')
                oasys.San.checkSanOtlCall(pks[1], {
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
                oasys.San.checkSanEditMode(true)
                oasys.San.populateSanSections('Test ref 38 part 2', testData.modifySan2)
                oasys.San.returnToOASys()
                oasys.Nav.clickButton('Next')
                oasys.San.checkSanGetAssessmentCall(pks[1], 2)

                rmp.checkIsNotOnMenu()  // Shouldn't be there

                // Sign and lock again, check API calls and OASYS_SET
                new oasys.Pages.SentencePlan.SentencePlanService().goto()

                oasys.Assessment.signAndLock({ expectCountersigner: true, countersigner: oasys.Users.probSanHeadPdu, countersignComment: 'Signing for the third time' })
                oasys.San.checkSanSigningCall(pks[1], oasys.Users.probSanUnappr, 'COUNTERSIGN')
                oasys.San.checkSanGetAssessmentCall(pks[1], 2)
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS', 'RSR'])
                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pks[1]}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                    SAN_ASSESSMENT_VERSION_NO: '2'
                })

                oasys.logout()

            })
        })
    })
})