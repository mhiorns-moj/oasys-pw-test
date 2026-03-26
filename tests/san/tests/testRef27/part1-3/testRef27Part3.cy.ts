import * as oasys from 'oasys'
import * as testData from '../../../data/testRef27'

describe('SAN integration - test ref 27', () => {

    it('Part 3', () => {

        log(`Lock Incomplete a probation OASys-SAN assessment (no SARA) when creating a new assessment and are prompted with decision to make`)

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            log(`Create an offender whose latest assessment is a WIP OASys-SAN assessment without a SARA.  
                ALL the SAN data has been validated but the sentence plan is NOT agreed`)

            const offender: OffenderDef = JSON.parse(offenderData as string)

            await oasys.login(oasys.users.probSanUnappr)
            await offender.searchAndSelectByPnc(offender.pnc)

            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getAllSetPksByPnc(offender.pnc, 'result', true)

            cy.get<number[]>('@result').then((pks) => {

                await san.gotoSan()
                await san.populateSanSections('Test 27 part 3 Complete SAN', testData.part3CompleteSan)
                await san.returnToOASys()
                await oasys.logout()

                log(`Log in as a user in a different NON SAN PILOT probation area.  
                    Search for and open up the Offender record in the SAN Pilot probation area - will currently have 'boilerplate' access
                    Click on the <Create Assessment> button - shown 'This offender is currently controlled by….' message
                    Click on <Yes> - now get 'WIP Assessment Screen' with various options
                    Click on <Yes - Guillotine WIP Immediately> - returns back to the Offender record
                    The user still has boilerplate access as they haven't yet created an assessment - just wanted to use this way for guilloting
                    Make a note of the date and time in the OASYS_SET field 'LASTUPD_DATE'`)

                await oasys.login(oasys.users.probHeadPdu)
                await offender.searchAndSelectByPnc(offender.pnc, oasys.users.probationSan)
                await oasys.clickButton('Create Assessment')
                await oasys.clickButton('Yes')
                await oasys.clickButton('Yes - Guillotine WIP Immediately')

                oasys.Db.getData(`select to_char(lastupd_from_san, '${oasysDateTime.oracleTimestampFormat}'), to_char(lastupd_date, '${oasysDateTime.oracleTimestampFormat}') from eor.oasys_set where oasys_set_pk = ${pks[0]}`, 'lastUpdDate1')
                // TODO added workaround for NOD-1xxx, ignore R2.2.2 as it might get created
                const questionsQuery = `select max(to_char(q.lastupd_date, '${oasysDateTime.oracleTimestampFormat}')) from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q
                                        where st.oasys_set_pk = s.oasys_set_pk and s.oasys_section_pk = q.oasys_section_pk
                                        and q.ref_question_code <> 'R2.2.2'
                                        and st.oasys_set_pk = ${pks[0]}`
                oasys.Db.getData(questionsQuery, 'questions1')

                cy.get<string[][]>('@lastUpdDate1').then((initialData) => {
                    cy.get<string[][]>('@questions1').then((questions1) => {

                        const lastUpdFromSan1 = oasysDateTime.stringToTimestamp(initialData[0][0])
                        const lastUpdDate1 = oasysDateTime.stringToTimestamp(initialData[0][1])
                        const latestQuestionUpdDate1 = oasysDateTime.stringToTimestamp(questions1[0][0])

                        log(`A Lock API has been sent to the SAN Service - parameters of OASYS_SET_PK, user ID and name - a 200 response has been received back
                        Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' populated by the return API response
                        Ensure the SAN section and the SSP section have both been set to 'COMPLETE_LOCKED'
                        Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`)

                        await san.queries.checkSanLockIncompleteCall(pks[0], oasys.users.probHeadPdu)
                        await san.queries.getSanApiTime(pks[0], 'SAN_GET_ASSESSMENT', 'getSanDataTime')
                        await oasys.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pks[0]}`, {
                            SAN_ASSESSMENT_LINKED_IND: 'Y',
                            CLONED_FROM_PREV_OASYS_SAN_PK: pks[1].toString(),
                        })

                        const sectionQuery = `select count(*) from eor.oasys_section where oasys_set_pk = ${pks[0]} 
                                                and section_status_elm = 'COMPLETE_LOCKED' and ref_section_code in ('SAN', 'SSP')`

                        oasys.Db.selectCount(sectionQuery, 'sections')
                        cy.get<number>('@sections').then((sections) => {
                            expect(sections).equal(2)
                        })
                        await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
                        await oasys.logout()

                        log(`Log back in as a user from the probation area of the offender
                        Open up the now read only assessment, navigate to the 'Strengths and Needs' screen
                        Click on the 'Open Strengths and Needs' button
                        Taken into the SAN Service - ensure the assessment is shown all in READ ONLY format and that the SAN part of the assessment shows correctly
                        Return back to the OASys part of the assessment
                        Navigate out to the 'Sentence Plan Service' - ensure the sentence plan is shown all in READ ONLY format
                        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
                        Close the assessment - back to the offender record`)

                        await oasys.login(oasys.users.probSanUnappr)
                        await oasys.history(offender)
                        await assessment.openLatest()
                        await san.gotoSanReadOnly('Accommodation', 'information')
                        await san.checkSanEditMode(false)
                        await san.returnToOASys()

                        await sentencePlan.spService.checkReadOnly()

                        await oasys.clickButton('Close')

                        log(`Check that NONE of the OASys-SAN assessment data has been updated - look at the last update dates in question and answers
                        and also on the OASYS_SET record and ensure they are NOT after the date and time noted above`)

                        oasys.Db.getData(questionsQuery, 'questions2')
                        oasys.Db.getData(`select to_char(lastupd_from_san, '${oasysDateTime.oracleTimestampFormat}'), to_char(lastupd_date, '${oasysDateTime.oracleTimestampFormat}') from eor.oasys_set where oasys_set_pk = ${pks[0]}`, 'lastUpdDate2')
                        cy.get<string[][]>('@questions2').then((questions2) => {
                            cy.get<string[][]>('@lastUpdDate2').then((updatedSetData2) => {

                                const latestQuestionUpdDate2 = oasysDateTime.stringToTimestamp(questions2[0][0])
                                const lastUpdFromSan2 = oasysDateTime.stringToTimestamp(updatedSetData2[0][0])
                                const lastUpdDate2 = oasysDateTime.stringToTimestamp(updatedSetData2[0][1])

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
