import * as oasys from 'oasys'

describe('SAN integration - test ref 37 part 4', () => {
    /**
     * Carry out a test for rolling back a countersigned assessment to ensure the san service process the request
     */

    it('Countersign again', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            await oasys.login(oasys.users.probSanHeadPdu)
            await offender.searchAndSelectByPnc(offender.pnc)
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
                    'san', 0
                )
                await san.checkSanEditMode(false)
                await san.returnToOASys()

                // Countersign the assessment
                await san.queries.checkSanGetAssessmentCall(pk, 0)
                await signing.countersign({ page: oasys.Pages.SentencePlan.SentencePlanService, comment: 'Test 37 part 4 countersign again' })

                await san.queries.checkSanCountersigningCall(pk, oasys.users.probSanHeadPdu, 'COUNTERSIGNED')
                await san.queries.checkSanGetAssessmentCall(pk, 0)
                await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
                await oasys.logout()

            })
        })
    })
})