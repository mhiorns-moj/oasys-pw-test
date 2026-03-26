import * as oasys from 'oasys'

describe('SAN integration - test ref 27', () => {

    it('Part 5', () => {

        log(`Lock Incomplete a prison OASys-SAN assessment when the Offender has been discharged from Prison (WIP guillotines immediately)`)

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            log(`a PRISON offender in a SAN PILOT Prison area whose latest assessment is a PRISON WIP OASys-SAN assessment (not signed and locked).  
                ALL the SAN data has been validated and the sentence plan has been agreed
                The offender also has a Probation owner (NON SAN Pilot area).`)

            const offender: OffenderDef = JSON.parse(offenderData as string)

            await oasys.login(oasys.users.prisSanUnappr)
            await offender.searchAndSelectByPnc(offender.pnc)

            await assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {
                await san.gotoSan()
                await san.populateSanSections('TestRef27 part 1 complete SAN', oasys.Populate.San.ExampleTest.sanPopulation1)
                await san.returnToOASys()
                await sentencePlan.populateMinimal()
                await oasys.clickButton('Next')
                await san.sanSections.checkCompletionStatus(true)
                new oasys.Pages.SentencePlan.SentencePlanService().checkCompletionStatus(true)

                log(`Open up the offender record
                    Using the CMS stub submit a 'discharge' message for the offender
                    The offender has now been released from prison - controlling owner is the Probation area and the WIP assessment is now showing as 'locked incomplete'`)

                await oasys.clickButton('Close')
                oasys.Offender.createDischargeEventForOffenderObject(offender)

                log(`Make a note of the date and time in the OASYS_SET field 'LASTUPD_DATE'
                    Check that Get Assessment has occurred BEFORE locking incomplete
                    A Lock API has been sent to the SAN Service - parameters of OASYS_SET_PK, user ID and name - a 200 response has been received back
                    Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' populated by the return API response
                    Ensure the SAN section and the SSP section have both been set to 'COMPLETE_LOCKED'
                    Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`)

                oasys.Db.getData(`select to_char(lastupd_from_san, '${oasysDateTime.oracleTimestampFormat}'), to_char(lastupd_date, '${oasysDateTime.oracleTimestampFormat}') from eor.oasys_set where oasys_set_pk = ${pk}`, 'lastUpdDate1')
                // TODO added workaround for NOD-1xxx, ignore R2.2.2 as it might get created
                const questionsQuery = `select max(to_char(q.lastupd_date, '${oasysDateTime.oracleTimestampFormat}')) from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q
                                                        where st.oasys_set_pk = s.oasys_set_pk and s.oasys_section_pk = q.oasys_section_pk
                                                        and q.ref_question_code <> 'R2.2.2'
                                                        and st.oasys_set_pk = ${pk}`
                oasys.Db.getData(questionsQuery, 'questions1')

                cy.get<string[][]>('@lastUpdDate1').then((initialData) => {
                    cy.get<string[][]>('@questions1').then((questions1) => {

                        const lastUpdFromSan1 = oasysDateTime.stringToTimestamp(initialData[0][0])
                        const lastUpdDate1 = oasysDateTime.stringToTimestamp(initialData[0][1])
                        const latestQuestionUpdDate1 = oasysDateTime.stringToTimestamp(questions1[0][0])

                        await oasys.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                            SAN_ASSESSMENT_LINKED_IND: 'Y',
                            CLONED_FROM_PREV_OASYS_SAN_PK: null,
                        })

                        const sectionQuery = `select count(*) from eor.oasys_section where oasys_set_pk = ${pk} 
                                                and section_status_elm = 'COMPLETE_LOCKED' and ref_section_code in ('SAN', 'SSP')`

                        oasys.Db.selectCount(sectionQuery, 'sections')
                        cy.get<number>('@sections').then((sections) => {
                            expect(sections).equal(2)
                        })
                        await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])

                        await oasys.logout()

                        await oasys.login(oasys.users.probHeadPdu)
                        await oasys.history(offender)
                        new oasys.Pages.Offender.OffenderDetails().controllingOwner.checkValue(oasys.users.probationNonSan)
                        new oasys.Pages.Offender.AssessmentsTab().assessments.checkData([{
                            name: 'status',
                            values: ['Locked Incomplete Assessment', 'Locked Incomplete Assessment']
                        }])

                        log(`Log in as a User in the Probation area.
                        Search for and open up the now read only locked incomplete assessment, navigate to the 'Strengths and Needs' screen
                        Click on the 'Open Strengths and Needs' button
                        Taken into the SAN Service - ensure the assessment is shown all in READ ONLY format and that the SAN part of the assessment shows correctly
                        Return back to the OASys part of the assessment
                        Navigate out to the 'Sentence Plan Service' - ensure the sentence plan is shown all in READ ONLY format
                        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
                        Close the assessment - back to the offender record`)

                        oasys.Assessment.open(2)
                        await san.gotoSanReadOnly('Accommodation', 'information')
                        await san.checkSanEditMode(false)
                        await san.returnToOASys()

                        await sentencePlan.spService.checkReadOnly()

                        await oasys.clickButton('Close')

                        log(`Check that NONE of the OASys-SAN assessment data has been updated - look at the last update dates in question and answers
                                and also on the OASYS_SET record and ensure they are NOT after the date and time noted above`)

                        oasys.Db.getData(questionsQuery, 'questions')
                        oasys.Db.getData(`select to_char(lastupd_from_san, '${oasysDateTime.oracleTimestampFormat}'), to_char(lastupd_date, '${oasysDateTime.oracleTimestampFormat}') from eor.oasys_set where oasys_set_pk = ${pk}`, 'lastUpdDate2')
                        cy.get<string[][]>('@questions').then((questions) => {
                            cy.get<string[][]>('@lastUpdDate2').then((updatedSetData) => {

                                const latestQuestionUpdDate2 = oasysDateTime.stringToTimestamp(questions[0][0])
                                const lastUpdFromSan2 = oasysDateTime.stringToTimestamp(updatedSetData[0][0])
                                const lastUpdDate2 = oasysDateTime.stringToTimestamp(updatedSetData[0][1])

                                expect(oasysDateTime.timestampDiff(latestQuestionUpdDate1, latestQuestionUpdDate2)).lte(0)
                                expect(oasysDateTime.timestampDiff(lastUpdFromSan1, lastUpdFromSan2)).lte(0)
                                expect(oasysDateTime.timestampDiff(lastUpdDate1, lastUpdDate2)).lte(0)

                                await oasys.logout()
                            })
                        })
                    })
                })
            })
        })
    })
})

