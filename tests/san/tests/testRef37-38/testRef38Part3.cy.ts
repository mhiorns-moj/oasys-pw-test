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


            await oasysDb.getAllSetPksByPnc(offender.pnc, '[pks]')
            cy.get<number[]>('@[pks]').then((pks) => {  // [0] = the second deleted assessment, [1] = the first one that will be rolled back

                // Open the assessment and check status
                await oasys.login(oasys.users.probSanUnappr)
                await offender.searchAndSelectByPnc(offender.pnc)
                await assessment.openLatest()

                const rmp = new oasys.Pages.Rosh.RiskManagementPlan()
                rmp.checkIsNotOnMenu()  // Shouldn't be there

                // Check it's now read-write
                await san.gotoSan('Accommodation', 'information')
                await san.queries.checkSanOtlCall(pks[1], {
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
                await san.checkSanEditMode(true)
                await san.populateSanSections('Test ref 38 part 2', testData.modifySan2)
                await san.returnToOASys()
                await oasys.clickButton('Next')
                await san.queries.checkSanGetAssessmentCall(pks[1], 2)

                rmp.checkIsNotOnMenu()  // Shouldn't be there

                // Sign and lock again, check API calls and OASYS_SET
                new oasys.Pages.SentencePlan.SentencePlanService().goto()

                await signing.signAndLock({ expectCountersigner: true, countersigner: oasys.users.probSanHeadPdu, countersignComment: 'Signing for the third time' })
                await san.queries.checkSanSigningCall(pks[1], oasys.users.probSanUnappr, 'COUNTERSIGN')
                await san.queries.checkSanGetAssessmentCall(pks[1], 2)
                await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS', 'RSR'])
                await oasys.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pks[1]}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                    SAN_ASSESSMENT_VERSION_NO: '2'
                })

                await oasys.logout()

            })
        })
    })
})