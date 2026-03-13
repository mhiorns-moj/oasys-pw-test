import * as oasys from 'lib'
import * as testData from '../../../data/testRef27'

describe('SAN integration - test ref 27', () => {

    it('Part 3', () => {

        cy.log(`Lock Incomplete a probation OASys-SAN assessment (no SARA) when creating a new assessment and are prompted with decision to make`)

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            cy.log(`Create an offender whose latest assessment is a WIP OASys-SAN assessment without a SARA.  
                ALL the SAN data has been validated but the sentence plan is NOT agreed`)

            const offender: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getAllSetPksByPnc(offender.pnc, 'result', true)

            cy.get<number[]>('@result').then((pks) => {

                oasys.San.gotoSan()
                oasys.San.populateSanSections('Test 27 part 3 Complete SAN', testData.part3CompleteSan)
                oasys.San.returnToOASys()
                oasys.logout()

                cy.log(`Log in as a user in a different NON SAN PILOT probation area.  
                    Search for and open up the Offender record in the SAN Pilot probation area - will currently have 'boilerplate' access
                    Click on the <Create Assessment> button - shown 'This offender is currently controlled by….' message
                    Click on <Yes> - now get 'WIP Assessment Screen' with various options
                    Click on <Yes - Guillotine WIP Immediately> - returns back to the Offender record
                    The user still has boilerplate access as they haven't yet created an assessment - just wanted to use this way for guilloting
                    Make a note of the date and time in the OASYS_SET field 'LASTUPD_DATE'`)

                oasys.login(oasys.Users.probHeadPdu)
                oasys.Offender.searchAndSelectByPnc(offender.pnc, oasys.Users.probationSan)
                oasys.Nav.clickButton('Create Assessment')
                oasys.Nav.clickButton('Yes')
                oasys.Nav.clickButton('Yes - Guillotine WIP Immediately')

                oasys.Db.getData(`select to_char(lastupd_date, ${oasys.OasysDateTime.oracleTimestampFormat})  from eor.oasys_set where oasys_set_pk = ${pks[0]}`, 'lastUpdDate')
                cy.get<string[][]>('@lastUpdDate').then((initialData) => {

                    const lastUpdDate = oasys.OasysDateTime.stringToTimestamp(initialData[0][0])

                    cy.log(`A Lock API has been sent to the SAN Service - parameters of OASYS_SET_PK, user ID and name - a 200 response has been received back
                        Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' populated by the return API response
                        Ensure the SAN section and the SSP section have both been set to 'COMPLETE_LOCKED'
                        Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`)

                    oasys.San.checkSanLockIncompleteCall(pks[0], oasys.Users.probHeadPdu, 0, 0)
                    oasys.San.getSanApiTime(pks[0], 'SAN_GET_ASSESSMENT', 'getSanDataTime')
                    oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pks[0]}`, {
                        SAN_ASSESSMENT_LINKED_IND: 'Y',
                        CLONED_FROM_PREV_OASYS_SAN_PK: pks[1].toString(),
                        SAN_ASSESSMENT_VERSION_NO: '1',
                        SSP_PLAN_VERSION_NO: '2',
                    })

                    const sectionQuery = `select count(*) from eor.oasys_section where oasys_set_pk = ${pks[0]} 
                                                and section_status_elm = 'COMPLETE_LOCKED' and ref_section_code in ('SAN', 'SSP')`

                    oasys.Db.selectCount(sectionQuery, 'sections')
                    cy.get<number>('@sections').then((sections) => {
                        expect(sections).equal(2)
                    })
                    oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
                    oasys.logout()

                    cy.log(`Log back in as a user from the probation area of the offender
                        Open up the now read only assessment, navigate to the 'Strengths and Needs' screen
                        Click on the 'Open Strengths and Needs' button
                        Taken into the SAN Service - ensure the assessment is shown all in READ ONLY format and that the SAN part of the assessment shows correctly
                        Return back to the OASys part of the assessment
                        Navigate out to the 'Sentence Plan Service' - ensure the sentence plan is shown all in READ ONLY format
                        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
                        Close the assessment - back to the offender record`)

                    oasys.login(oasys.Users.probSanUnappr)
                    oasys.Nav.history(offender)
                    oasys.Assessment.openLatest()
                    oasys.San.gotoSanReadOnly('Accommodation', 'information')
                    oasys.San.checkSanEditMode(false)
                    oasys.San.returnToOASys()

                    oasys.San.gotoSentencePlanReadOnly()
                    oasys.San.checkSentencePlanEditMode(false)
                    oasys.San.returnToOASys()

                    oasys.Nav.clickButton('Close')

                    cy.log(`Check that NONE of the OASys-SAN assessment data has been updated - look at the last update dates in question and answers
                        and also on the OASYS_SET record and ensure they are NOT after the date and time noted above`)

                    const questionsQuery = `select max(to_char(q.lastupd_date, ${oasys.OasysDateTime.oracleTimestampFormat})) from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q
                                                where st.oasys_set_pk = s.oasys_set_pk and s.oasys_section_pk = q.oasys_section_pk
                                                and st.oasys_set_pk = ${pks[0]}`

                    oasys.Db.getData(questionsQuery, 'questions')
                    oasys.Db.getData(`select to_char(lastupd_from_san, ${oasys.OasysDateTime.oracleTimestampFormat}), to_char(lastupd_date, ${oasys.OasysDateTime.oracleTimestampFormat}) from eor.oasys_set where oasys_set_pk = ${pks[0]}`, 'lastUpdDate2')
                    cy.get<string[][]>('@questions').then((questions) => {
                        cy.get<string[][]>('@lastUpdDate2').then((updatedSetData) => {

                            const latestQuestionUpdDate = oasys.OasysDateTime.stringToTimestamp(questions[0][0])
                            const lastUpdFromSan = oasys.OasysDateTime.stringToTimestamp(updatedSetData[0][0])
                            const lastUpdDate2 = oasys.OasysDateTime.stringToTimestamp(updatedSetData[0][1])

                            expect(oasys.OasysDateTime.timestampDiff(lastUpdDate, latestQuestionUpdDate)).lte(0)
                            expect(oasys.OasysDateTime.timestampDiff(lastUpdDate, lastUpdFromSan)).lte(0)
                            expect(oasys.OasysDateTime.timestampDiff(lastUpdDate, lastUpdDate2)).lte(0)

                            oasys.logout()
                        })
                    })
                })
            })
        })
    })
})
