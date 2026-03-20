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
                oasys.login(oasys.Users.probSanHeadPdu)
                oasys.Offender.searchAndSelectByPnc(offender.pnc)
                oasys.Assessment.openLatest()

                oasys.San.gotoSanReadOnly('Accommodation','information')

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
                new oasys.Pages.SentencePlan.SentencePlanService().goto()
                oasys.San.checkSanGetAssessmentCall(pk, 0)
                oasys.Nav.clickButton('Countersign')
                const countersigning = new oasys.Pages.Signing.Countersigning()
                countersigning.selectAction.setValue('Countersign')
                countersigning.comments.setValue('Test 37 part 2 countersigning')
                countersigning.ok.click()
                oasys.San.checkSanCountersigningCall(pk, oasys.Users.probSanHeadPdu, 'COUNTERSIGNED')
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
                oasys.logout()

            })
        })
    })

})
