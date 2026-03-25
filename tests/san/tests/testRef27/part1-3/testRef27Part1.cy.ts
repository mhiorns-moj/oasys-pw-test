import * as oasys from 'oasys'

describe('SAN integration - test ref 27', () => {

    it('Part 1', () => {

        Cypress.on('uncaught:exception', () => {
            log('Cypress Exception')
            return false
        })

        log(`Lock Incomplete OASys-SAN assessment (no SARA) from the Offender's Assessments Tab - SAN Data Validated, Sentence Plan has been agreed`)

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            log(`Create an offender whose latest assessment is a WIP OASys-SAN assessment without a SARA.
                ALL the SAN data has been validated, sentence plan has been agreed.`)

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.users.probSanUnappr)
            await offender.searchAndSelectByPnc(offender.pnc)

            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {
                await san.gotoSan()
                await san.populateSanSections('TestRef27 part 1 complete SAN', oasys.Populate.San.ExampleTest.sanPopulation1)
                await san.returnToOASys()
                oasys.ArnsSp.runScript('populateMinimal')

                log(`Open up the offender record
                    Click on the <Lock Incomplete> button and then click <OK> to confirm the action
                    Assessment now showing as locked incomplete
                    Make a note of the date and time in the OASYS_SET field 'LASTUPD_DATE'`)

                await oasys.clickButton('Close')
                oasys.Assessment.lockIncomplete()

                oasys.Db.getData(`select to_char(lastupd_from_san,'${oasysDateTime.oracleTimestampFormat}'), to_char(lastupd_date, '${oasysDateTime.oracleTimestampFormat}')  from eor.oasys_set where oasys_set_pk = ${pk}`, 'lastUpdDate')
                cy.get<string[][]>('@lastUpdDate').then((initialData) => {

                    const lastUpdFromSan = oasysDateTime.stringToTimestamp(initialData[0][0])
                    const lastUpdDate = oasysDateTime.stringToTimestamp(initialData[0][1])

                    log(`A Lock API has been sent to the SAN Service - parameters of OASYS_SET_PK, user ID and name - a 200 response has been received back
                        Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' populated by the return API response
                        Ensure the SAN section and the SSP section have both been set to 'COMPLETE_LOCKED'
                        Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`)

                    await san.checkSanLockIncompleteCall(pk, oasys.users.probSanUnappr)
                    await san.getSanApiTime(pk, 'SAN_GET_ASSESSMENT', 'getSanDataTime')
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

                    // TODO added workaround for NOD-1xxx, ignore R2.2.2 as it might get created
                    const questionsQuery = `select max(to_char(q.lastupd_date, '${oasysDateTime.oracleTimestampFormat}')) from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q
                                            where st.oasys_set_pk = s.oasys_set_pk and s.oasys_section_pk = q.oasys_section_pk
                                            and q.ref_question_code <> 'R2.2.2'
                                            and st.oasys_set_pk = ${pk}`

                    oasys.Db.getData(questionsQuery, 'questions1')

                    log(`Open up the now read only assessment, navigate to the 'Strengths and Needs' screen
                        Click on the 'Open Strengths and Needs' button
                        Taken into the SAN Service - ensure the assessment is shown all in READ ONLY format and that the SAN part of the assessment shows correctly
                        Return back to the OASys part of the assessment
                        Navigate out to the 'Sentence Plan Service' - ensure the sentence plan is shown all in READ ONLY format
                        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
                        Close the assessment - back to the offender record`)

                    await assessment.openLatest()
                    await san.gotoSanReadOnly()
                    await san.checkSanEditMode(false)
                    await san.returnToOASys()

                    oasys.ArnsSp.runScript('checkReadOnly')

                    await oasys.clickButton('Close')

                    log(`Check that NONE of the OASys-SAN assessment data has been updated - look at the last update dates in question and answers
                            and also on the OASYS_SET record and ensure they are NOT after the date and time noted above`)

                    oasys.Db.getData(questionsQuery, 'questions2')
                    oasys.Db.getData(`select to_char(lastupd_from_san,'${oasysDateTime.oracleTimestampFormat}'), to_char(lastupd_date, '${oasysDateTime.oracleTimestampFormat}') from eor.oasys_set where oasys_set_pk = ${pk}`, 'lastUpdDate2')
                    cy.get<string[][]>('@questions1').then((questions1) => {
                        cy.get<string[][]>('@questions2').then((questions2) => {
                            cy.get<string[][]>('@lastUpdDate2').then((updatedSetData) => {

                                const latestQuestionUpdDate1 = oasysDateTime.stringToTimestamp(questions1[0][0])
                                const latestQuestionUpdDate2 = oasysDateTime.stringToTimestamp(questions2[0][0])
                                const lastUpdFromSan2 = oasysDateTime.stringToTimestamp(updatedSetData[0][0])
                                const lastUpdDate2 = oasysDateTime.stringToTimestamp(updatedSetData[0][1])

                                expect(oasysDateTime.timestampDiff(latestQuestionUpdDate1, latestQuestionUpdDate2)).lte(0)
                                expect(oasysDateTime.timestampDiff(lastUpdFromSan, lastUpdFromSan2)).lte(0)
                                expect(oasysDateTime.timestampDiff(lastUpdDate, lastUpdDate2)).lte(0)

                                log(`Rollback the locked incomplete assessment
                                        Ensure the SAN service respond with a 200
                                        Lock incomplete the assessment again without any changes - ensure the SAN Service respond accordingly with a 200`)

                                oasys.logout()
                                oasys.login(oasys.users.admin, oasys.users.probationSan)
                                await offender.searchAndSelectByPnc(offender.pnc)
                                await assessment.openLatest()
                                oasys.Assessment.rollBack('Test 27 part 1')
                                await san.checkSanRollbackCall(pk, oasys.users.admin)
                                await oasys.clickButton('Close')
                                oasys.Assessment.lockIncomplete()
                                await san.checkSanLockIncompleteCall(pk, oasys.users.admin)

                                // Delete assessment in preparation for part 2
                                oasys.Assessment.deleteLatest()

                                oasys.logout()
                            })
                        })
                    })
                })
            })
        })
    })
})
