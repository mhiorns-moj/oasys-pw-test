import * as oasys from 'oasys'

describe('SAN integration - tests 39-40', () => {
    /**
     * Merge - where BOTH offenders have OASys-SAN assessments
     * Merge two offenders where BOTH of the offenders have OASys-SAN assessments - check it posts the correct MERGE API
     * 
     * De-merge - where BOTH offenders have OASys-SAN assessments
     * Using the offender who was previously merged in this situation, create and complete a new OASys-SAN assessment.
     * The carry out a De-merge - check it posts the correct MERGE API
     */

    it('Merge tests part 5 - demerge offenders', () => {

        Cypress.on('uncaught:exception', () => {
            return false
        })

        // Get offender details
        cy.task('retrieveValue', 'offender1').then((offenderData) => {
            const offender1 = JSON.parse(offenderData as string)
            cy.task('retrieveValue', 'offender2').then((offenderData) => {
                const offender2 = JSON.parse(offenderData as string)

                // Get current assessment PKs
                await oasysDb.getAllSetPksByProbationCrn(offender1.probationCrn, 'currentOff1Pks')
                await oasysDb.getAllSetPksByProbationCrn(offender2.probationCrn, 'currentOff2Pks')
                cy.get<number[]>('@currentOff1Pks').then((currentOff1Pks) => {
                    cy.get<number[]>('@currentOff2Pks').then((currentOff2Pks) => {

                        await oasys.login(oasys.users.admin, oasys.users.probationSan)
                        await offender.searchAndSelectByPnc(offender2.pnc)

                        // Demerge
                        await oasys.clickButton('Demerge')
                        await oasys.clickButton('Confirm Demerge')
                        await oasys.clickButton('Demerge')
                        cy.get('#apexConfirmBtn').click()
                        await oasys.clickButton('Close')
                        await oasys.logout()

                        // Get new assessment PKs
                        await oasysDb.getAllSetPksByProbationCrn(offender1.probationCrn, 'newOff1Pks')
                        await oasysDb.getAllSetPksByProbationCrn(offender2.probationCrn, 'newOff2Pks')
                        cy.get<number[]>('@newOff1Pks').then((newOff1Pks) => {
                            cy.get<number[]>('@newOff2Pks').then((newOff2Pks) => {

                                await san.queries.checkSanMergeCall(oasys.users.admin, 3)
                            })
                        })

                    })

                })
            })
        })
    })
})