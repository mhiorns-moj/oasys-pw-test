import * as oasys from 'oasys'
import * as testData from '../../data/testRef10'


describe('SAN integration - test ref 10', () => {

    it('Test ref 10 - Second SAN assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)


            cy.log(`Log in as the same assessor as that in Test Ref 9
                    Open up the offender record from Test Ref 9
                    As a SAN User, Create a new 3.2 'review' assessment with RSP, electing to use the SAN which has defaulted to 'Yes'.
                    Check that a CreateAssessment API post was sent off with the correct details in it (has the OASYS_SET_PK of the newly created record, the parameter for previous PK
                    is set to the previous OASys-SAN assessment that we have cloned from).
                    Check the cloning from 3.2 to 3.2 assessment.  Case ID, Section 1 (sexual offence), RoSH Screening cloned through.
                    Sections 2 to 13 and SAN exist in the background and have been updated with the data from the Updated SAN Assessment carried out in Test Ref 9.`)

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.createProb({ purposeOfAssessment: 'Review' })  // Assume SAN defaults to 'Yes'

            oasys.Db.getAllSetPksByPnc(offender.pnc, 'pks')
            cy.get<number[]>('@pks').then((pks) => {
                const pk = pks[0]
                const prevPk = pks[1]
                oasys.San.checkSanCreateAssessmentCall(pk, prevPk, oasys.Users.probSanUnappr, oasys.Users.probationSanCode, 'REVIEW')

                oasys.Db.checkCloning(pk, prevPk, [
                    '2', '7', '8', '9', '10', '11', '12', '13',
                    'SAQ', 'ROSH', 'ROSHFULL', 'ROSHSUM', 'RMP', 'SAN',
                ])

                oasys.Db.checkCloningExpectMismatch(pk, prevPk, [
                    '1', '3', '4', '5', '6', 'SKILLSCHECKER'     // These sections were modified in the offender record prior to creating this assessment, so will not match the previous one 
                ])

                cy.log(`Check the OASYS_SET record.  The SAN_ASSESSMENT_LINKED_IND field is set to 'Y'. 
                        The CLONED_FROM_PREV_OASYS_SAN_PK field is set to the previous OASys-SAN assessment.The SAN_ASSESSMENT_VERSION_NO field is blank.
                        The LASTUPD_FROM_SAN is set from the getAssessment API that has been called directly after creating this new 'Review' assessment.
                        There is NO full analysis showing.
                        RSR and OSP-IIC and OSP-DC are all calculated.
                        The SAN 'Strengths and Needs Sections' menu option has a green tick against it for the data being complete.`)

                oasys.San.getSanApiTimeAndCheckDbValues(pk, 'Y', prevPk)
                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    RSR_PERCENTAGE_SCORE: '9.96',
                    RSR_STATIC_OR_DYNAMIC: 'DYNAMIC',
                    RSR_ERROR_COUNT: '0',
                    OSP_IIC_PERCENTAGE_SCORE: '3.33',
                    OSP_DC_PERCENTAGE_SCORE: '6.18',
                })

                const r62 = new oasys.Pages.Rosh.RoshFullAnalysisSection62().checkIsNotOnMenu()
                const rmp = new oasys.Pages.Rosh.RiskManagementPlan().checkIsNotOnMenu()
                const san = new oasys.Pages.Assessment.SanSections().checkCompletionStatus(true)

                cy.log(`Go to the SAN assessment, change data in the ''accommodation' and 'thinking, behaviours and attitudes' sections to state 
                        they are linked to risk of serious harm (ensure the data is validated).
                        Return to OASys, a Full analysis is now showing with sections 6.1 and 6.2 in it.  
                        The 'Strengths and Needs Sections' menu option remains showing with a green tick`)

                oasys.San.gotoSan()
                oasys.San.populateSanSections('TestRef10 modify SAN', testData.modifySan)
                oasys.San.returnToOASys()
                san.next.click()
                r62.checkIsOnMenu()
                san.checkCompletionStatus(true)

                cy.log(`Go to the first screen of the Risk of Serious Harm Screening and ensure it shows the TWO ARNS sections at R1.1
                        Complete the full analysis flagging the offender as 'Medium' risk
                        Check the Risk Management Plan screen - ensure the checklist shows 'Accommodation' and 'Thinking, behaviours and attitudes' 
                        The Key Information field contains the sentence 'They have accommodation and Thinking, behaviours and attitudes linked to risk.' 
                        Also check the 'motivation' sentence is correct to what has been selected.
                        Complete entry of the Risk Management Plan screen.`)

                const roshScreening1 = new oasys.Pages.Rosh.RoshScreeningSection1().goto()
                roshScreening1.areasOfConcern.getValues('areas')
                cy.get<string[]>('@areas').then((areas) => {
                    expect(areas).includes('Accommodation')
                    expect(areas).includes('Thinking, behaviours and attitudes')
                })

                oasys.Populate.RoshPages.RoshSummary.specificRiskLevel('Medium')
                rmp.goto()
                rmp.accommodation.checkStatus('enabled')
                rmp.thinking.checkStatus('notVisible')
                rmp.sanThinking.checkStatus('enabled')
                rmp.keyInformation.getValue('keyInformation')
                cy.get<string>('@keyInformation').then((keyInformation) => {
                    expect(keyInformation).includes('They have accommodation and thinking, behaviours and attitudes linked to risk.')
                    expect(keyInformation).not.includes('otiv')  // Shouldn't contain Motivation or motivation
                })
                oasys.Populate.RoshPages.RiskManagementPlan.minimalWithTextFields()

                cy.log(`Complete the review sentence plan
                        Mark as Complete all sections of the Review assessment (not applicable for Case ID and SAN menu option already ticked)
                        Sign and Lock the assessment (if it requires a countersigner that countersign it)
                        Check the database has the correct section data in it.  Then log out.`)

                new oasys.Pages.Assessment.OffendingInformation().goto().markCompleteAndCheck()
                const screening2To4 = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto()
                screening2To4.rationale.setValue('Rationale')
                new oasys.Pages.Rosh.RoshScreeningSection1().markCompleteAndCheck()
                new oasys.Pages.Rosh.RoshFullAnalysisSection62().markCompleteAndCheck()
                new oasys.Pages.Rosh.RoshSummary().markCompleteAndCheck()
                new oasys.Pages.Rosh.RiskManagementPlan().markCompleteAndCheck()

                new oasys.Pages.SentencePlan.SentencePlanService().goto().checkCompletionStatus(true)
                oasys.Assessment.signAndLock({ expectCountersigner: true, countersigner: oasys.Users.probSanHeadPdu })

                oasys.logout()

                oasys.login(oasys.Users.probSanHeadPdu)
                oasys.Assessment.countersign({ offender: offender })
                oasys.logout()

                // Check that the correct number of sections have been completed
                const sectionQuery = `select count(*) from eor.oasys_section 
                                    where oasys_set_pk = ${pk} and section_status_elm = 'COMPLETE_LOCKED'`
                cy.log(sectionQuery)
                oasys.Db.selectCount(sectionQuery, 'sectionCount')
                cy.get<number>('@sectionCount').then((sectionCount) => {
                    expect(sectionCount).equal(22)
                })
            })

        })
    })
})