import * as oasys from 'lib'

describe('SAN integration - test ref 22 part 1', () => {

    /** 
        Open up the 'winning' Offender record from Test Ref 21
        Click on 'Demerge'
        The demerge screen shows ONE 3.2 assessment within the 'Manage Assessments - Merged Offender assessments available for reassignment' section  -
             DO NOT CHANGE THIS, this is the 3.2 assessment that was created POST merge
        Click on the >Confirm Demerge> button - screen changed to 'Demerge' screen showing Offender (offender 2 winner) on the lhs with the ONE 3.2
             assessment created post merge and Deleted Offender (0ffender 1)
        Click on the <Demerge> button.
        Offenders have now been demerged.
        Check the OFFENDER_LINK record has the 'REVERSED_IND' field set to 'Y' and the 'LINK_TYPE_ELM' field set to 'DE_MERGE'
        Check that a MERGE API has gone off to the SAN Service with the correct parameters as detailed in the above table and in the Interfaces specification:
    */
    it('Test ref 22 part 1 - demerge offenders', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender1').then((offenderData) => {
            const offender1 = JSON.parse(offenderData as string)
            cy.task('retrieveValue', 'offender2').then((offenderData) => {
                const offender2 = JSON.parse(offenderData as string)

                oasys.login(oasys.Users.admin, oasys.Users.probationSan)
                oasys.Offender.searchAndSelectByPnc(offender2.pnc)

                // Demerge
                oasys.Nav.clickButton('Demerge')
                // Workaround for uncaught javascript error in OASys
                Cypress.on('uncaught:exception', () => {
                    return false
                })
                oasys.Nav.clickButton('Confirm Demerge')
                oasys.Nav.clickButton('Demerge')
                cy.get('#apexConfirmBtn').click()
                oasys.Nav.clickButton('Close')
                oasys.logout()

                oasys.San.checkSanMergeCall(oasys.Users.admin, 5)
            })
        })
    })
})