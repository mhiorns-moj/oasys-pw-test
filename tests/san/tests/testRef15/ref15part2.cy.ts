import * as oasys from 'oasys'
import * as testData from '../../data/testRef15'

describe('SAN integration - test ref 15 part 2', () => {

    it('Test ref 15 part 2 - Check SAN readonly, then complete SAN as assessor', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.prisSanCAdm)
            oasys.Nav.history()

            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')
            cy.get<number>('@result').then((pk) => {

                cy.log(`Navigate out to S&N section - check the OTL parameters (should go across as READ ONLY).  Check you cannot edit anything in the SAN Assessment
                    Return back to the OASys assessment.
                    Navigate out to Sentence Plan section - check the OTL parameters (should go across as READ ONLY).  Check you cannot edit anything in the Sentence Plan
                    Return back to the OASys assessment.`)

                oasys.San.gotoSanReadOnly('Accommodation', 'information')
                oasys.San.checkSanEditMode(false)
                oasys.San.returnToOASys()
                oasys.San.checkSanOtlCall(pk, {
                    'crn': null,
                    'pnc': offender.pnc,
                    'nomisId': offender.nomisId,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '1',
                    'location': 'PRISON',
                    'sexuallyMotivatedOffenceHistory': 'NO',
                }, {
                    'displayName': oasys.Users.prisSanCAdm.forenameSurname,
                    'accessMode': 'READ_ONLY',
                },
                    'san', null
                )

                oasys.ArnsSp.runScript('checkReadOnly')

                oasys.San.checkSanOtlCall(pk, {
                    'crn': null,
                    'pnc': offender.pnc,
                    'nomisId': offender.nomisId,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '1',
                    'location': 'PRISON',
                    'sexuallyMotivatedOffenceHistory': 'NO',
                }, {
                    'displayName': oasys.Users.prisSanCAdm.forenameSurname,
                    'planAccessMode': 'READ_ONLY',
                },
                    'sp', null
                )

                cy.log(`Log out and log back in again as the actual Assessor of the OASys-SAN assessment.  This assessor needs to have a framework role of 
                        'Unapproved' with a default countersigner that has 'Approved Prison POM, approved PQiP, NQO or unapproved Probation POM' 
                        (can sign up to Medium risk with exceptions).
                    Navigate out to the 'Strengths and Needs Sections' - complete ALL of the SAN assessment with anything you like but say Yes to Drugs
                        and make sure you select some drugs and include Other and then enter in exactly 400 characters for the text to go with other drugs.
                    Return back to the OASys assessment.  Have to navigate to a new screen - This will activate a pull of the SAN data.
                    Check that the database now has data in sections 2 to 12, definitely check that Section 8 contains data for the drugs entered in the SAN Assessment and that the Other Drug text field has all 400 characters in it.
                    The 'Strengths and Needs Sections' menu item has a green tick against it`)

                oasys.logout()
                oasys.login(oasys.Users.prisSanUnappr)
                oasys.Offender.searchAndSelectByPnc(offender.pnc)
                oasys.Assessment.openLatest()


                oasys.San.gotoSan()
                oasys.San.populateSanSections('Test ref 15', testData.sanPopulation)
                oasys.San.returnToOASys()
                oasys.Nav.clickButton('Next')

                oasys.Db.checkAnswers(pk, testData.dataFromSan, 'answerCheck', true)
                new oasys.Pages.Assessment.SanSections().checkCompletionStatus(true)
                cy.get<boolean>('@answerCheck').then((answerCheck) => {
                    expect(answerCheck).equal(false)
                })

                cy.log(`Complete the remaining sections in the OASys assessment and invoke a full analysis.  Complete the full analysis and set the offender as 'HIGH' risk.`)

                const rosh1 = new oasys.Pages.Rosh.RoshScreeningSection1().goto()
                rosh1.mark1_2AsNo.click()
                rosh1.mark1_3AsNo.click()
                rosh1.r1_4.setValue('No')

                const rosh2 = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto()
                rosh2.r2_3.setValue('No')
                rosh2.rationale.setValue('Because')
                rosh2.r3_1.setValue('No')
                rosh2.r3_2.setValue('No')
                rosh2.r3_3.setValue('No')
                rosh2.r3_4.setValue('No')
                rosh2.r4_1.setValue('No')
                rosh2.r4_6.setValue('No')
                rosh2.r4_4.setValue('No')

                oasys.Populate.RoshPages.RoshSummary.specificRiskLevel('High')
                oasys.Populate.RoshPages.RiskManagementPlan.minimalWithTextFields(true)
                new oasys.Pages.Assessment.SummarySheet().goto()

                cy.log(`Navigate out to the 'Sentence Plan Service' 
                    Ensure that the OTL sends the correct data for the new 'criminogenicNeedsData' parameter (check to the Summary Sheet in OASys)
                    Complete the sentence plan with at least one goal/steps and ensure you 'agree the plan' which will give a 'COMPLETE' status back.  
                        Do not change the sentence plan type.
                    Return back to the OASys assessment.`)

                oasys.ArnsSp.runScript('populateMinimal')

                oasys.San.checkSanOtlCall(pk, {
                    'crn': null,
                    'pnc': offender.pnc,
                    'nomisId': offender.nomisId,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '1',
                    'location': 'PRISON',
                    'sexuallyMotivatedOffenceHistory': 'NO',
                }, {
                    'displayName': oasys.Users.prisSanUnappr.forenameSurname,
                    'planAccessMode': 'READ_WRITE',
                },
                    'sp', null, testData.otlCrimNeeds
                )

                cy.log(`For each of the OASys assessment sections, apart from Case ID and Summary Sheet, click on the 'Mark as Complete' flag.
                    Sign and lock the assessment`)

                rosh1.markCompleteAndCheck()

                new oasys.Pages.Rosh.RoshSummary().markCompleteAndCheck()
                new oasys.Pages.Rosh.RiskManagementPlan().markCompleteAndCheck()

                const isp = new oasys.Pages.SentencePlan.SentencePlanService().goto()

                oasys.Assessment.signAndLock({ expectCountersigner: true, countersignComment: 'Signing test 15' })

                oasys.logout()
            })
        })
    })
})
