import * as oasys from 'lib'

/**
 * Test script used by all of the mapping tests.  Need to run the aaSanMappingTestOffender script first to create an offender and store the details in a local file.
 */

export const mappingTestOffenderFile = 'tests/data/local/mappingTestsOffender.txt'

export function mappingTest(script: SanScript, reset130: boolean = false) {

    // Occasional error in SAN 'Cannot read properties of null (reading 'postMessage')'.  Need to workaround it with the following:
    Cypress.on('uncaught:exception', () => {
        cy.log('Cypress Exception')
        return false
    })

    cy.readFile(mappingTestOffenderFile).then((offenderDetails) => {
        const mappingTestOffender = JSON.parse(offenderDetails) as OffenderDef

        oasys.login(oasys.Users.admin, oasys.Users.probationSan)
        oasys.Offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
        oasys.Assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
        oasys.logout()

        oasys.login(oasys.Users.probSanUnappr)
        oasys.Offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
        oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

        oasys.Db.getLatestSetPkByPnc(mappingTestOffender.pnc, 'assessmentPk')
        cy.get<number>('@assessmentPk').then((assessmentPk) => {
            cy.log(`Assessment PK: ${assessmentPk}`)

            oasys.San.runScript(assessmentPk, script, 'result', reset130)
            cy.get<boolean>('@result').then((failed) => {
                expect(failed).to.be.false
            })

            oasys.logout()
        })
    })
}
