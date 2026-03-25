import * as oasys from 'oasys'

describe('SAN integration - test ref 38 part 4', () => {
    /**
     * Have a completed 3.2 assessment that has been countersigned.
     * Create a new 3.2 assessment and enter some data including SAN data.
     * Delete that second 3.2 assessment. 
     * Roll back the first 3.2 assessment and carry on with that does it work with SAN statuses?
     */

    it('Countersign again', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.users.probSanHeadPdu)
            await offender.searchAndSelectByPnc(offender.pnc)
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {

                await assessment.openLatest()

                // Open as countsigner
                oasys.logout()
                oasys.login(oasys.users.probSanHeadPdu)
                oasys.Nav.history()
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
                    'displayName': oasys.users.probSanHeadPdu.forenameSurname,
                    'accessMode': 'READ_ONLY',
                },
                    'san', 2
                )
                await san.checkSanEditMode(false)
                await san.returnToOASys()

                // Countersign the assessment
                new oasys.Pages.SentencePlan.SentencePlanService().goto()
                await san.checkSanGetAssessmentCall(pk, 2)
                oasys.Assessment.countersign({ comment: 'Countersigning for the third time' })

                await san.checkSanCountersigningCall(pk, oasys.users.probSanHeadPdu, 'COUNTERSIGNED')
                await san.checkSanGetAssessmentCall(pk, 2)
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])

                // Check the signing history
                oasys.Nav.history()
                const expectedValues: ColumnValues[] = [
                    {
                        name: 'action',
                        values: ['Countersigning', 'Signing', 'Rollback', 'Countersigning', 'Signing', 'Rollback', 'Countersigning', 'Signing']
                    },
                    {
                        name: 'who',
                        values: [
                            oasys.users.probSanHeadPdu.forenameSurname, oasys.users.probSanUnappr.forenameSurname, oasys.users.admin.forenameSurname, oasys.users.probSanHeadPdu.forenameSurname,
                            oasys.users.probSanUnappr.forenameSurname, oasys.users.admin.forenameSurname, oasys.users.probSanHeadPdu.forenameSurname, oasys.users.probSanUnappr.forenameSurname
                        ]
                    },
                    {
                        name: 'date',
                        values: [oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString()]
                    },
                    {
                        name: 'comment',
                        values: [
                            'Countersigning for the third time', 'Signing for the third time', 'Test 38 part 2 rolling back again, after deleting the second assessment',
                            'Test 37 part 4 countersign again', 'Test 37 part 3 signing again', 'Test 37 part 3 rollback', 'Test 37 part 2 countersigning', 'Test 37 part 1 signing'
                        ]
                    },
                ]
                new oasys.Pages.Assessment.OffenderInformation().signingHistory.checkData(expectedValues)

                oasys.logout()

            })
        })
    })
})