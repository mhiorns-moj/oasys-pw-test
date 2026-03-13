import * as oasys from 'oasys'
import * as testData from '../../../data/testRef27'

describe('SAN integration - test ref 27', () => {

    it('Part 4', () => {

        cy.log(`Lock Incomplete a prison OASys-SAN assessment when creating a new assessment where the internal transfer has stalled`)

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            cy.log(`Create PRISON offender in a SAN PILOT Prison area whose latest assessment is a WIP OASys-SAN assessment (not signed and locked) and does NOT have a SARA.
                ALL the SAN data has been validated and the sentence plan has been agreed`)

            const offender: OffenderDef = JSON.parse(offenderData as string)

            // First delete the BCS as it prevents the transfer
            oasys.login(oasys.Users.admin, oasys.Users.prisonSan)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            oasys.Assessment.deleteLatest()
            oasys.logout()

            oasys.login(oasys.Users.prisSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {
                oasys.San.gotoSan()
                oasys.San.populateSanSections('TestRef27 part 1 complete SAN', oasys.Populate.San.ExampleTest.sanPopulation1)
                oasys.San.returnToOASys()
                oasys.ArnsSp.runScript('populateMinimal')
                oasys.Nav.clickButton('Previous')

                oasys.Db.checkSingleAnswer(pk, '9', '9.2', 'refAnswer', '0')  // above population sets binge drinking to no

                cy.log(`Open up the offender record
                    From the offender record click on the <Open S&N> button - taken into the SAN Assessment in EDIT mode
                    Change or enter more data that will affect OASys into the SAN Assessment.  
                    Take screenshots of your input but do not click on <Save and Continue> - just navigate to a different screen - we need 'unvalidated' data
                    Return back to the Offender record`)

                oasys.Nav.clickButton('Close')
                oasys.Nav.clickButton('Open S&N')
                const landingPage = new oasys.Pages.San.LandingPage()
                landingPage.confirmCheck.setValue(true)
                landingPage.confirm.click()
                oasys.San.populateSanSections('Test 27 part 4 SAN Alcohol', testData.test4ModifyAlcohol)
                oasys.San.returnToOASys()

                cy.log(`From the offender record click on the <Open SSP> button - taken into the Sentence Plan Service in EDIT mode
                    Change or enter more data that changes the sentence plan e.g. add an objective.  Take screenshots of your input but do not agree the plan
                    Return back to the Offender record`)

                oasys.ArnsSp.runScript('addGoal', { openFromOffender: true })
                oasys.logout()

                cy.log(`Using the CMS stub submit an internal reception event to a NON SAN PILOT Prison area
                     - the transfer will stall due to the WIP OASys assessment, the new prison will be noted in the 'Awaiting prison' field on the Offender Management tab
                    Now log in as a user to the 'awaiting' NON SAN PILOT prison area.  
                    Search for and open up the Offender record currently owned by the SAN Pilot probation area - will have 'full' access to the offender record`)

                oasys.login(oasys.Users.prisHomds)
                offender.receptionCode = 'TRANSFER IN FROM OTHER ESTABLISHMENT'
                oasys.Offender.enterPrisonStubDetailsAndCreateReceptionEvent(offender)
                oasys.Offender.searchAndSelectByPnc(offender.pnc, oasys.Users.prisonSan)
                const offenderDetails = new oasys.Pages.Offender.OffenderDetails()
                offenderDetails.offenderManagementTab.click()
                new oasys.Pages.Offender.OffenderManagementTab().awaitingPrisonOwner.checkValue(oasys.Users.prisonNonSan)

                cy.log(`Click on the <Create Assessment> button - shown 'Work In Progress Assessment at another Establishment…. Recording (Work in Progress)….' message
                    Click on the <Lock Incomplete> button - returns back to the Offender record
                    The user now has full access to the offender and the assessment is showing as Locked Incomplete
                    The controlling owner is now set to the Awaiting Prison Owner`)

                oasys.Nav.clickButton('Create Assessment')
                oasys.Nav.clickButton('Lock Incomplete')
                offenderDetails.controllingOwner.checkValue(oasys.Users.prisonNonSan)

                cy.log(`Make a note of the date and time in the OASYS_SET field 'LASTUPD_DATE'
                    Check that Get Assessment has occurred BEFORE locking incomplete
                    A Lock API has been sent to the SAN Service - parameters of OASYS_SET_PK, user ID and name - a 200 response has been received back
                    Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' populate by the return API response
                    Check the database for the assessment and it shows data mapped from the updates carried out on the offender record
                        above before the assessment was locked incomplete
                    Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' populated by the return API response
                    Ensure the SAN section and the SSP section have both been set to 'COMPLETE_LOCKED'
                    Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`)

                oasys.Db.getData(`select to_char(lastupd_from_san, '${oasys.OasysDateTime.oracleTimestampFormat}'), to_char(lastupd_date, '${oasys.OasysDateTime.oracleTimestampFormat}') from eor.oasys_set where oasys_set_pk = ${pk}`, 'lastUpdDate1')
                // TODO added workaround for NOD-1xxx, ignore R2.2.2 as it might get created
                const questionsQuery = `select max(to_char(q.lastupd_date, '${oasys.OasysDateTime.oracleTimestampFormat}')) from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q
                                                        where st.oasys_set_pk = s.oasys_set_pk and s.oasys_section_pk = q.oasys_section_pk
                                                        and q.ref_question_code <> 'R2.2.2'
                                                        and st.oasys_set_pk = ${pk}`
                oasys.Db.getData(questionsQuery, 'questions1')

                cy.get<string[][]>('@lastUpdDate1').then((initialData) => {
                    cy.get<string[][]>('@questions1').then((questions1) => {

                        const lastUpdFromSan1 = oasys.OasysDateTime.stringToTimestamp(initialData[0][0])
                        const lastUpdDate1 = oasys.OasysDateTime.stringToTimestamp(initialData[0][1])
                        const latestQuestionUpdDate1 = oasys.OasysDateTime.stringToTimestamp(questions1[0][0])

                        oasys.San.checkSanGetAssessmentCall(pk, 0)
                        oasys.San.checkSanLockIncompleteCall(pk, oasys.Users.prisHomds)
                        oasys.San.checkSanLockIncompleteTimestamp(pk)

                        oasys.Db.checkSingleAnswer(pk, '9', '9.2', 'refAnswer', '2')  // change from offender record sets binge drinking

                        oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                            SAN_ASSESSMENT_LINKED_IND: 'Y',
                            CLONED_FROM_PREV_OASYS_SAN_PK: null,
                        })

                        const sectionQuery = `select count(*) from eor.oasys_section where oasys_set_pk = ${pk} 
                                                and section_status_elm = 'COMPLETE_LOCKED' and ref_section_code in ('SAN', 'SSP')`

                        oasys.Db.selectCount(sectionQuery, 'sections')
                        cy.get<number>('@sections').then((sections) => {
                            expect(sections).equal(2)
                        })
                        oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])

                        cy.log(`Open up the now read only assessment, navigate to the 'Strengths and Needs' screen
                        Click on the 'Open Strengths and Needs' button
                        Taken into the SAN Service - ensure the assessment is shown all in READ ONLY format and that the SAN part of the assessment 
                            shows correctly including the 'unvalidated' data that was captured in screenshots above (this proves that the SAN service ARE 
                            creating versions of the SAN assessment with unvalidated data in it)
                        Return back to the OASys part of the assessment
                        Navigate out to the 'Sentence Plan Service' - ensure the sentence plan is shown all in READ ONLY format and you 
                            can see the screenshot changes that were made above
                        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
                        Close the assessment - back to the offender record`)

                        oasys.Assessment.openLatest()
                        oasys.San.gotoSanReadOnly('Accommodation', 'information')
                        oasys.San.checkSanEditMode(false)
                        oasys.San.goto('Alcohol use', 'information')
                        oasys.San.checkReadonlyText(
                            'Has TestRefTwentySeven-Four shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
                            'Evidence of binge drinking or excessive alcohol use')
                        oasys.San.returnToOASys()

                        oasys.ArnsSp.runScript('checkGoalCount', { readonly: true, currentGoals: 2, futureGoals: 0 })

                        oasys.Nav.clickButton('Close')

                        cy.log(`Check that NONE of the OASys-SAN assessment data has been updated - look at the last update dates in question and answers
                             and also on the OASYS_SET record and ensure they are NOT after the date and time noted above`)

                        oasys.Db.getData(questionsQuery, 'questions2')
                        oasys.Db.getData(`select to_char(lastupd_from_san, '${oasys.OasysDateTime.oracleTimestampFormat}'), to_char(lastupd_date, '${oasys.OasysDateTime.oracleTimestampFormat}') from eor.oasys_set where oasys_set_pk = ${pk}`, 'lastUpdDate2')
                        cy.get<string[][]>('@questions2').then((questions2) => {
                            cy.get<string[][]>('@lastUpdDate2').then((updatedSetData) => {

                                const latestQuestionUpdDate2 = oasys.OasysDateTime.stringToTimestamp(questions2[0][0])
                                const lastUpdFromSan2 = oasys.OasysDateTime.stringToTimestamp(updatedSetData[0][0])
                                const lastUpdDate2 = oasys.OasysDateTime.stringToTimestamp(updatedSetData[0][1])

                                expect(oasys.OasysDateTime.timestampDiff(latestQuestionUpdDate1, latestQuestionUpdDate2)).lte(0)
                                expect(oasys.OasysDateTime.timestampDiff(lastUpdFromSan1, lastUpdFromSan2)).lte(0)
                                expect(oasys.OasysDateTime.timestampDiff(lastUpdDate1, lastUpdDate2)).lte(0)

                                oasys.logout()
                            })
                        })
                    })
                })
            })
        })
    })
})
