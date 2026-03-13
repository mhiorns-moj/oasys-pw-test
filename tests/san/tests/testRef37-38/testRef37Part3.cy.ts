import * as oasys from 'lib'

describe('SAN integration - test ref 37 part 3', () => {
    /**
     * Carry out a test for rolling back a countersigned assessment to ensure the san service process the request
     */

    it('Roll back the assessment and check API calls and assessment status, then sign again', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.admin, oasys.Users.probationSan)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {

                oasys.Assessment.openLatest()

                oasys.San.gotoSanReadOnly('Accommodation', 'information')
                oasys.San.checkSanOtlCall(pk, {
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
                    'displayName': oasys.Users.admin.forenameSurname,
                    'accessMode': 'READ_ONLY',
                },
                    'san', 0
                )
                oasys.San.checkSanEditMode(false)
                oasys.San.returnToOASys()

                // Roll back the assessment
                oasys.Assessment.rollBack('Test 37 part 3 rollback')

                // Check OASYS_SET and API calls
                oasys.San.getSanApiTimeAndCheckDbValues(pk, 'Y', null, null)
                oasys.San.checkSanRollbackCall(pk, oasys.Users.admin, 0, 0)
                oasys.logout()

                // Sign and lock again, check API calls and OASYS_SET
                oasys.login(oasys.Users.probSanUnappr)
                oasys.Nav.history()

                // Check it's now read-write
                oasys.San.gotoSan('Accommodation', 'information')
                oasys.San.checkSanOtlCall(pk, {
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
                oasys.San.returnToOASys()
                oasys.Nav.clickButton('Next')
                oasys.San.checkSanGetAssessmentCall(pk, 0)

                new oasys.Pages.SentencePlan.IspSection52to8().goto()

                oasys.Assessment.signAndLock({ expectCountersigner: true, countersigner: oasys.Users.probSanHeadPdu, countersignComment: 'Test 37 part 3 signing again' })
                oasys.San.checkSanSigningCall(pk, oasys.Users.probSanUnappr, 'COUNTERSIGN', 0, 0)
                oasys.San.checkSanGetAssessmentCall(pk, 0)
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