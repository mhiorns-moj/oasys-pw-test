import * as oasys from 'oasys'

describe('SAN integration - test ref 27', () => {

    it('Part 5', () => {

        cy.log(`Lock Incomplete a prison OASys-SAN assessment when the Offender has been discharged from Prison (WIP guillotines immediately)`)

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            cy.log(`a PRISON offender in a SAN PILOT Prison area whose latest assessment is a PRISON WIP OASys-SAN assessment (not signed and locked).  
                ALL the SAN data has been validated and the sentence plan has been agreed
                The offender also has a Probation owner (NON SAN Pilot area).`)

            const offender: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.prisSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {
                oasys.San.gotoSan()
                oasys.San.populateSanSections('TestRef27 part 1 complete SAN', oasys.Populate.San.ExampleTest.sanPopulation1)
                oasys.San.returnToOASys()
                oasys.ArnsSp.runScript('populateMinimal')
                oasys.Nav.clickButton('Next')
                new oasys.Pages.Assessment.SanSections().checkCompletionStatus(true)
                new oasys.Pages.SentencePlan.SentencePlanService().checkCompletionStatus(true)

                cy.log(`Open up the offender record
                    Using the CMS stub submit a 'discharge' message for the offender
                    The offender has now been released from prison - controlling owner is the Probation area and the WIP assessment is now showing as 'locked incomplete'`)

                oasys.Nav.clickButton('Close')
                oasys.Offender.createDischargeEventForOffenderObject(offender)

                cy.log(`Make a note of the date and time in the OASYS_SET field 'LASTUPD_DATE'
                    Check that Get Assessment has occurred BEFORE locking incomplete
                    A Lock API has been sent to the SAN Service - parameters of OASYS_SET_PK, user ID and name - a 200 response has been received back
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

                        oasys.logout()

                        oasys.login(oasys.Users.probHeadPdu)
                        oasys.Nav.history(offender)
                        new oasys.Pages.Offender.OffenderDetails().controllingOwner.checkValue(oasys.Users.probationNonSan)
                        new oasys.Pages.Offender.AssessmentsTab().assessments.checkData([{
                            name: 'status',
                            values: ['Locked Incomplete Assessment', 'Locked Incomplete Assessment']
                        }])

                        cy.log(`Log in as a User in the Probation area.
                        Search for and open up the now read only locked incomplete assessment, navigate to the 'Strengths and Needs' screen
                        Click on the 'Open Strengths and Needs' button
                        Taken into the SAN Service - ensure the assessment is shown all in READ ONLY format and that the SAN part of the assessment shows correctly
                        Return back to the OASys part of the assessment
                        Navigate out to the 'Sentence Plan Service' - ensure the sentence plan is shown all in READ ONLY format
                        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
                        Close the assessment - back to the offender record`)

                        oasys.Assessment.open(2)
                        oasys.San.gotoSanReadOnly('Accommodation', 'information')
                        oasys.San.checkSanEditMode(false)
                        oasys.San.returnToOASys()

                        oasys.ArnsSp.runScript('checkReadOnly')

                        oasys.Nav.clickButton('Close')

                        cy.log(`Check that NONE of the OASys-SAN assessment data has been updated - look at the last update dates in question and answers
                                and also on the OASYS_SET record and ensure they are NOT after the date and time noted above`)

                        oasys.Db.getData(questionsQuery, 'questions')
                        oasys.Db.getData(`select to_char(lastupd_from_san, '${oasys.OasysDateTime.oracleTimestampFormat}'), to_char(lastupd_date, '${oasys.OasysDateTime.oracleTimestampFormat}') from eor.oasys_set where oasys_set_pk = ${pk}`, 'lastUpdDate2')
                        cy.get<string[][]>('@questions').then((questions) => {
                            cy.get<string[][]>('@lastUpdDate2').then((updatedSetData) => {

                                const latestQuestionUpdDate2 = oasys.OasysDateTime.stringToTimestamp(questions[0][0])
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

