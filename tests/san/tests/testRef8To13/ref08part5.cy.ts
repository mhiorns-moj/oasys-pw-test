import * as oasys from 'oasys'


describe('SAN integration - test ref 08 part 5', () => {

    it('Test ref 8 part 5 - Countersign SAN assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            log(`Log out and log back in as the countersigner to the probation area
                Take a note of what is in the OASYS_SET record for fields 'LASTUPD_FROM_SAN' and 'SAN_ASSESSMENT_VERSION_NO' (should have been set from the response to the SIGN API)
                Open up the countersigning task and then open up the assessment
                Countersigner shown the correct 'Countersigning Overview' screen
                Return back to the assessment - now on the first Initial Sentence Plan screen`)

            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk')
            cy.get<number>('@pk').then((pk) => {
                const sanColumnsQuery = `select LASTUPD_FROM_SAN, SAN_ASSESSMENT_VERSION_NO from eor.oasys_set where oasys_set_pk = ${pk}`
                oasys.Db.getData(sanColumnsQuery, 'oasysSetData')
                cy.get<string[][]>('@oasysSetData').then((sanColumnsQuery1) => {

                    oasys.login(oasys.users.probSanHeadPdu)
                    await offender.searchAndSelectByPnc(offender.pnc)
                    await assessment.openLatest()

                    log(`Navigate to the 'Strengths and Needs Sections' screen - 
                        Click on the button <Open Strengths and Needs> - launches into the SAN Assessment.  Ensure you can navigate through the SAN Assessment and it is ALL read only.
                        Return back to the assessment via the button/link - SAN assessment disappears and returned to the 'Strengths and Needs Sections' screen in the same browser tab
                        Navigate to the first screen of the Initial Sentence Plan - Countersign button is available
                        Continue to countersign the assessment - check that a 'Countersign API' has been posted to the SAN Service and the contents are correct
                            (outcome passed is 'COUNTERSIGNED' along with countersigners ID and name)
                        Check that on the SNS_MESSAGE table there are records for OGRS, RSR and AssSumm`)

                    await san.gotoSanReadOnly('Accommodation', 'information')
                    await san.checkSanEditMode(false)
                    await san.returnToOASys()
                    oasys.Assessment.countersign({ page: oasys.Pages.SentencePlan.SentencePlanService, comment: 'Test comment' })
                    oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])  // Note AssSumm only at this stage, as others were sent on signing
                    new oasys.Pages.Tasks.TaskManager().checkCurrent()

                    await san.checkSanCountersigningCall(pk, oasys.users.probSanHeadPdu, 'COUNTERSIGNED')

                    log(`Open up the Offender record
                        Ensure the latest completed assessment shows an 'S&N' icon next to it
                        Ensure the Offender record shows the new button called <Open S&N'> next to the <RSR> button`)

                    await offender.searchAndSelectByCrn(offender.probationCrn)
                    const assessmentsTab = new oasys.Pages.Offender.AssessmentsTab()
                    assessmentsTab.assessments.getData('assessmentTable')
                    cy.get<ColumnValues[]>('@assessmentTable').then((assessmentTable) => {
                        expect(assessmentTable[1].values[0]).contain('Includes Strengths and Needs')
                    })
                    new oasys.Pages.Offender.OffenderDetails().openSan.checkStatus('enabled')

                    log(`Check the OASYS_SET record.  Ensure the fields 'LASTUPD_FROM_SAN' and 'SAN_ASSESSMENT_VERSION_NO' remain the same as noted above
                        Ensure the OASys database for this assessment has questions in Sections 2 to 12 from the SAN Assessment
                        Ensure there is no Section 13
                        Ensure that the new SAN section has questions in it from the SAN assessment`)

                    oasys.Db.getData(sanColumnsQuery, 'oasysSetData')
                    cy.get<string[][]>('@oasysSetData').then((sanColumnsQuery2) => {
                        expect(JSON.stringify(sanColumnsQuery2)).equal(JSON.stringify(sanColumnsQuery1))
                    })
                    cy.wrap(false).as('sectionAnswersResult')
                    cy.get<boolean>('@sectionAnswersResult').then((failed) => {
                        expect(failed).equal(false)
                    })
                    await san.checkCountOfQuestionsInSection(pk, '13', 0)
                    await san.checkCountOfQuestionsInSection(pk, 'SAN', 12)

                    log(`Open up the completed OASys-SAN asessment - now shows all READ ONLY.  
                        Click on the <Print> button - check that the initial print screen does NOT show options for sections 2 to 13 and the SAQ
                        Select to print 'All Assessment Sections' - ensure the printout has NOT included sections 2 to 13 or the SAQ.  Revisions made to existing screens MUST be included in the printout`)

                    await assessment.openLatest()
                    new oasys.Pages.Assessment.OffenderInformation().religion.checkStatus('readonly')
                    const predictors = new oasys.Pages.Assessment.Predictors().goto()
                    predictors.o1_32.checkStatus('readonly')
                    predictors.print.click()
                    const print = new oasys.Pages.Assessment.Other.PrintAssessment()
                    print.section2.checkStatus('notVisible')
                    print.section3.checkStatus('notVisible')
                    print.section4.checkStatus('notVisible')
                    print.section5.checkStatus('notVisible')
                    print.section6.checkStatus('notVisible')
                    print.section7.checkStatus('notVisible')
                    print.section8.checkStatus('notVisible')
                    print.section9.checkStatus('notVisible')
                    print.section10.checkStatus('notVisible')
                    print.section11.checkStatus('notVisible')
                    print.section12.checkStatus('notVisible')
                    print.section13.checkStatus('notVisible')
                    print.selfAssessmentForm.checkStatus('notVisible')
                    print.allSections.setValue(true)

                    const inclusions = [
                        '1 - Offence & Sentence Information',
                        'SAN Section',
                        'Accommodation',
                        'Employment and', 'education',
                        'Finance',
                        'Drug use',
                        'Alcohol use',
                        'Health and', 'wellbeing',
                        'Personal', 'relationships and', 'community',
                        'Thinking,', 'behaviours and', 'attitudes',
                        'Lifestyle &', 'Associates',
                    ]
                    const exclusions = [, '2 - Analysis of Offences', '3 - Accommodation',
                        '4 - Education, Training and Employability', '5 - Financial Management and Income',
                        '6 - Relationships', '7 - Lifestyle and Associates',
                        '8 - Drug Misuse', '9 - Alcohol Misuse',
                        '10 - Emotional Well-being', '11 - Thinking and Behaviour',
                        '12 - Attitudes', '13 - Health and Other Considerations',
                        'Self Assessment Form']

                    oasys.Pdf.checkPdf(() => { print.print.click() }, inclusions, exclusions, 'pdf')
                    print.cancel.click()
                    cy.get<boolean>('@pdf').then((failed) => expect(failed).equal(false))

                    oasys.logout()
                })

            })

        })
    })
})