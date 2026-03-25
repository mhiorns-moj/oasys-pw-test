import * as oasys from 'oasys'

describe('SAN integration - test ref 37 part 2', () => {
    /**
     * Carry out a test for rolling back a countersigned assessment to ensure the san service process the request
     */

    it('Countersign the assessment', () => {


        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')
            cy.get<number>('@result').then((pk) => {

                // Open as countersigner
                oasys.login(oasys.users.probSanHeadPdu)
                await offender.searchAndSelectByPnc(offender.pnc)
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
                    'displayName': oasys.users.probSanHeadPdu.forenameSurname,
                    'accessMode': 'READ_ONLY',
                },
                    'san', 0
                )
                await san.checkSanEditMode(false)
                await san.returnToOASys()

                // Countersign the assessment
                new oasys.Pages.SentencePlan.SentencePlanService().goto()
                await san.checkSanGetAssessmentCall(pk, 0)
                await oasys.clickButton('Countersign')
                const countersigning = new oasys.Pages.Signing.Countersigning()
                countersigning.selectAction.setValue('Countersign')
                countersigning.comments.setValue('Test 37 part 2 countersigning')
                countersigning.ok.click()
                await san.checkSanCountersigningCall(pk, oasys.users.probSanHeadPdu, 'COUNTERSIGNED')
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
                oasys.logout()

            })
        })
    })

})
