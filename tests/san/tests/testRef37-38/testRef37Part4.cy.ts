import * as oasys from 'oasys'

describe('SAN integration - test ref 37 part 4', () => {
    /**
     * Carry out a test for rolling back a countersigned assessment to ensure the san service process the request
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
                    'san', 0
                )
                oasys.San.checkSanEditMode(false)
                oasys.San.returnToOASys()

                // Countersign the assessment
                oasys.San.checkSanGetAssessmentCall(pk, 0)
                oasys.Assessment.countersign({ page: oasys.Pages.SentencePlan.SentencePlanService, comment: 'Test 37 part 4 countersign again' })

                oasys.San.checkSanCountersigningCall(pk, oasys.Users.probSanHeadPdu, 'COUNTERSIGNED')
                oasys.San.checkSanGetAssessmentCall(pk, 0)
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
                oasys.logout()

            })
        })
    })
})