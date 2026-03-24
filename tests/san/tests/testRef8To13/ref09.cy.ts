import * as oasys from 'oasys'
import * as testData from '../../data/testRef9'


describe('SAN integration - test ref 09', () => {

    it('Test ref 9 - Check SAN assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)


            log(`Log in as the same assessor as that in Test Ref 8
                    Open up the offender record from Test Ref 8
                    Ensure there is a button showing called <Open Strengths and Needs> - should be visible as the user can view the assessments and there is a non-deleted OASys-SAN assessment. 
                    Click on that button - OASys disappears and SAN Assessment appears (check OTL parameters, accessMode should be 'EDIT')
                    SAN Assessment is in EDIT MODE - change some of the OASys mapping data in several sections of the SAN Assessment and <Save> it so that it validates in SAN.
                    DO NOT answer 'Yes' to any of the sections 'linked to risk' questions.  Ensure all sections are marked as complete.
                    Return back to OASys.`)

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk')
            cy.get<number>('@pk').then((pk) => {

                oasys.San.gotoSanFromOffender()
                oasys.San.checkSanOtlCall(pk, {
                    'crn': offender.probationCrn,
                    'pnc': offender.pnc,
                    'nomisId': null,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '1',
                    'location': 'COMMUNITY',
                    'sexuallyMotivatedOffenceHistory': 'YES',
                }, {
                    'displayName': oasys.Users.probSanUnappr.forenameSurname,
                    'accessMode': 'READ_WRITE',
                }, 'san', null
                )
                oasys.San.populateSanSections('TestRef9 modify SAN', testData.modifySan)
                oasys.San.checkSanSectionsCompletionStatus(9)
                oasys.San.returnToOASys()

                log(`Open up the latest fully completed OASys-SAN assessment - navigate to the 'Open Strengths and Needs'  section and link out to the SAN Service
                    Ensure the SAN Assessment opens up in READ ONLY MODE (can we check the OTL API to ensure correct parameters passed across) and the data mappings that were changed above ARE NOT showing in the SAN Assessment as that should ONLY be showing the SAN Assessment version that was saved at the time of S&L.
                    Return back to OASys.
                    Log out.`)

                oasys.Assessment.openLatest()
                oasys.San.gotoSanReadOnly('Accommodation', 'information')
                oasys.San.checkSanEditMode(false)
                cy.get('#main-content').then((container) => {
                    expect(container.find('.summary__answer:contains("Settled"):visible').length).equal(1)
                    expect(container.find('.summary__answer--secondary:contains("Living with friends or family"):visible').length).equal(1)
                    oasys.San.returnToOASys()
                    oasys.Nav.clickButton('Next')
                    oasys.Db.checkSingleAnswer(pk, '5', '5.4', 'refAnswer', '2')  // Should be 2 in the assessment (source of income = offending only).  Change in offender record would return 1 if it impacted the assessment.
                    oasys.logout()
                })
            })
        })
    })
})