import * as oasys from 'oasys'

describe('SAN integration - test ref 21 part 3', () => {

    it('Test ref 21 part 3 - merge offenders', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender1').then((offenderData) => {
            const offender1: OffenderDef = JSON.parse(offenderData as string)
            cy.task('retrieveValue', 'offender2').then((offenderData) => {
                const offender2: OffenderDef = JSON.parse(offenderData as string)

                // Check original cloning details
                oasys.Db.getAllSetPksByPnc(offender2.pnc, 'originalOffender2Pks')

                cy.get<number[]>('@originalOffender2Pks').then((originalOffender2Pks) => {
                    const oasysSetQuery = `select cloned_from_prev_oasys_san_pk from eor.oasys_set 
                                                where cms_prob_number = '${offender2.probationCrn}'
                                                and deleted_date is null order by initiation_date desc`
                    oasys.Db.getData(oasysSetQuery, 'originalOffender2OasysSetData')
                    cy.get<number[]>('@originalOffender2OasysSetData').then((originalOffender2OasysSetData) => {
                        expect(originalOffender2OasysSetData[0] == originalOffender2Pks[1]) // Assessment 6
                        expect(originalOffender2OasysSetData[1] == originalOffender2Pks[3]) // Assessment 5
                        expect(originalOffender2OasysSetData[2] == originalOffender2Pks[3]) // Assessment 4
                        expect(originalOffender2OasysSetData[3] == null) // Assessment 3
                        expect(originalOffender2OasysSetData[4] == null) // Assessment 2
                        expect(originalOffender2OasysSetData[5] == null) // Assessment 1
                    })

                    // Change offender 1 PNC to trigger the merge

                    await oasys.login(oasys.users.probHeadPdu)
                    await oasys.history(offender1)

                    const offenderDetails = new oasys.Pages.Offender.OffenderDetails()
                    offenderDetails.pnc.setValue(offender2.pnc) // Cypress will automatically OK the alert
                    offenderDetails.save.click()

                    await oasys.logout()

                    // Login to pilot area to grant the merge and retain ownership
                    await oasys.login(oasys.users.probSanHeadPdu)
                    oasys.Task.grantMerge(offender2.surname)

                    // Get new assessment PKs and oasys_set data
                    oasys.Db.getAllSetPksByPnc(offender2.pnc, 'mergedOffenderPks', true)

                    cy.get<number[]>('@mergedOffenderPks').then((mergedOffenderPks) => {

                        oasys.Db.getData(oasysSetQuery, 'mergedOasysSetData')
                        cy.get<number[]>('@mergedOasysSetData').then((mergedOasysSetData) => {

                            expect(mergedOasysSetData[0] == mergedOffenderPks[1]) // Assessment 6
                            expect(mergedOasysSetData[1] == mergedOffenderPks[3]) // Assessment 5
                            expect(mergedOasysSetData[2] == mergedOffenderPks[3]) // Assessment 4
                            expect(mergedOasysSetData[3] == null) // Assessment 3
                            expect(mergedOasysSetData[4] == null) // Assessment 2
                            expect(mergedOasysSetData[5] == null) // Assessment 1
                            expect(mergedOasysSetData[6] == null) // Assessment on offender 1

                            await san.queries.checkSanMergeCall(oasys.users.probSanHeadPdu, 5)

                            await oasys.logout()
                        })
                    })
                })

            })
        })
    })
})