import * as oasys from 'oasys'
import * as testData from '../../data/testRef17'


describe('SAN integration - test ref 17 part 3', () => {

    it('Test ref 17 part 3 - Countersign SAN assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            log(`Navigate to the 'Strengths and Needs Sections' screen - 
                Click on the button <Open Strengths and Needs> - launches into the SAN Assessment.  Ensure you can navigate through the SAN Assessment and it is ALL read only.
                Return back to the assessment via the button/link - SAN assessment disappears and returned to the 'Strengths and Needs Sections' screen in the same browser tab`)

            oasys.login(oasys.Users.probSanPo)
            oasys.Nav.history()
            oasys.San.gotoSanReadOnly('Accommodation', 'information')
            oasys.San.checkSanEditMode(false)
            oasys.San.returnToOASys()

            log(`Navigate to the only screen of the Initial Sentence Plan - Countersign button is available
                    Continue to countersign the assessment - check that a 'Countersign API' has been posted to the SAN Service and the contents are correct, including the
                        'outcome' being 'COUNTERSIGNED' along with the countersigners ID and name
                    Check that on the SNS_MESSAGE table there are records for OGRS, RSR, OPD and AssSumm (with URL asssummsan)`)

            oasys.Assessment.countersign({ page: oasys.Pages.SentencePlan.SentencePlanService, comment: 'Countersigning test ref 17' })
            // TODO restore OPD check (needs IOM stub) oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OPD'])    // Others checked at signing
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])

            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk')
            cy.get<number>('@pk').then((pk) => {

                oasys.San.checkSanCountersigningCall(pk, oasys.Users.probSanPo, 'COUNTERSIGNED')

                log(`Open up the Offender record
                            Ensure the latest completed assessment shows an 'S&N/SSP' icon next to it
                            Ensure the Offender record shows the new buttons called <Open S&N'> and <Open SPP> next to the <RSR> button`)

                oasys.Offender.searchAndSelectByPnc(offender.pnc)
                new oasys.Pages.Offender.AssessmentsTab().assessments.checkData([{ name: 'san', values: ['Includes Strengths and Needs / Sentence Plan Service'] }])
                const off = new oasys.Pages.Offender.OffenderDetails()
                off.openSan.checkStatus('enabled')
                off.openSp.checkStatus('enabled')

                log(`Check the OASYS_SET record.  Ensure the fields 'LASTUPD_FROM_SAN', 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' remain the same as noted above
                            Ensure the OASys database for this assessment has questions in Sections 2 to 12 from the SAN Assessment
                            Ensure that the new SAN section has questions in it from the SAN assessment`)

                cy.task('retrieveValue', 'sanColumnsQuery1').then((sanColumnsQuery1) => {

                    const sanColumnsQuery = `select LASTUPD_FROM_SAN, SAN_ASSESSMENT_VERSION_NO, SSP_PLAN_VERSION_NO from eor.oasys_set where cms_prob_number = '${offender.probationCrn}'`
                    oasys.Db.getData(sanColumnsQuery, 'oasysSetData')
                    cy.get<string[][]>('@oasysSetData').then((sanColumnsQuery2) => {
                        expect(JSON.stringify(sanColumnsQuery2)).equal(sanColumnsQuery1)
                    })

                    oasys.Db.checkAnswers(pk, testData.dataFromSan, 'answerCheck', true)
                    cy.get<boolean>('@answerCheck').then((answerCheck) => {
                        expect(answerCheck).equal(false)
                    })

                    log(`Click on the <Print> button - check that the initial print screen does NOT show options for sections 2 to 13, SAQ and Skills Checker
                    Select to print 'All Assessment Sections' - ensure the printout has NOT included sections 2 to 13, SAQ and Skills Checker.  
                        Revisions made to existing screens MUST be included in the printout`)

                    oasys.Assessment.openLatest()
                    oasys.Nav.clickButton('Print')
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

