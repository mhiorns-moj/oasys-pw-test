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

            await oasys.login(oasys.users.probSanHeadPdu)
            await offender.searchAndSelect(offender1)
            await oasysDb.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {

                await assessment.openLatest()

                // Open as countsigner
                await oasys.logout()
                await oasys.login(oasys.users.probSanHeadPdu)
                await oasys.history()
                await san.gotoSanReadOnly()
                await san.queries.checkSanOtlCall(pk, {
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
                await san.queries.checkSanGetAssessmentCall(pk, 2)
                await signing.countersign({ comment: 'Countersigning for the third time' })

                await san.queries.checkSanCountersigningCall(pk, oasys.users.probSanHeadPdu, 'COUNTERSIGNED')
                await san.queries.checkSanGetAssessmentCall(pk, 2)
                await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])

                // Check the signing history
                await oasys.history()
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

                await oasys.logout()

            })
        })
    })
})