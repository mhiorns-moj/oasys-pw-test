import * as oasys from 'lib'

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

            oasys.login(oasys.Users.probSanHeadPdu)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {

                oasys.Assessment.openLatest()

                // Open as countsigner
                oasys.logout()
                oasys.login(oasys.Users.probSanHeadPdu)
                oasys.Nav.history()
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
                    'displayName': oasys.Users.probSanHeadPdu.forenameSurname,
                    'accessMode': 'READ_ONLY',
                },
                    'san', 2
                )
                oasys.San.checkSanEditMode(false)
                oasys.San.returnToOASys()

                // Countersign the assessment
                new oasys.Pages.SentencePlan.IspSection52to8().goto()
                oasys.San.checkSanGetAssessmentCall(pk, 2)
                oasys.Assessment.countersign({ comment: 'Countersigning for the third time' })

                oasys.San.checkSanCountersigningCall(pk, oasys.Users.probSanHeadPdu, 'COUNTERSIGNED', 2, 2)
                oasys.San.checkSanGetAssessmentCall(pk, 2)
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
                            oasys.Users.probSanHeadPdu.forenameSurname, oasys.Users.probSanUnappr.forenameSurname, oasys.Users.admin.forenameSurname, oasys.Users.probSanHeadPdu.forenameSurname,
                            oasys.Users.probSanUnappr.forenameSurname, oasys.Users.admin.forenameSurname, oasys.Users.probSanHeadPdu.forenameSurname, oasys.Users.probSanUnappr.forenameSurname
                        ]
                    },
                    {
                        name: 'date',
                        values: [oasys.OasysDateTime.oasysDateAsString(), oasys.OasysDateTime.oasysDateAsString(), oasys.OasysDateTime.oasysDateAsString(), oasys.OasysDateTime.oasysDateAsString(), oasys.OasysDateTime.oasysDateAsString(), oasys.OasysDateTime.oasysDateAsString(), oasys.OasysDateTime.oasysDateAsString(), oasys.OasysDateTime.oasysDateAsString()]
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