import * as oasys from 'oasys'

describe('SAN integration - test ref 37 part 3', () => {
    /**
     * Carry out a test for rolling back a countersigned assessment to ensure the san service process the request
     */

    it('Roll back the assessment and check API calls and assessment status, then sign again', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.users.admin, oasys.users.probationSan)
            await offender.searchAndSelectByPnc(offender.pnc)
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {

                await assessment.openLatest()

                await san.gotoSanReadOnly('Accommodation', 'information')
                await san.checkSanOtlCall(pk, {
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
                    'displayName': oasys.users.admin.forenameSurname,
                    'accessMode': 'READ_ONLY',
                },
                    'san', 0
                )
                await san.checkSanEditMode(false)
                await san.returnToOASys()

                // Roll back the assessment
                oasys.Assessment.rollBack('Test 37 part 3 rollback')

                // Check OASYS_SET and API calls
                await san.checkSanRollbackCall(pk, oasys.users.admin)
                oasys.logout()

                // Sign and lock again, check API calls and OASYS_SET
                oasys.login(oasys.users.probSanUnappr)
                oasys.Nav.history()

                // Check it's now read-write
                await san.gotoSan('Accommodation', 'information')
                await san.checkSanOtlCall(pk, {
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
                await san.returnToOASys()
                await oasys.clickButton('Next')
                await san.checkSanGetAssessmentCall(pk, 0)

                new oasys.Pages.SentencePlan.SentencePlanService().goto()

                await signing.signAndLock({ expectCountersigner: true, countersigner: oasys.users.probSanHeadPdu, countersignComment: 'Test 37 part 3 signing again' })
                await san.checkSanSigningCall(pk, oasys.users.probSanUnappr, 'COUNTERSIGN')
                await san.checkSanGetAssessmentCall(pk, 0)
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS', 'RSR'])
                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                    SAN_ASSESSMENT_VERSION_NO: '0'
                })

                oasys.logout()

            })
        })
    })
})