import * as oasys from 'oasys'

describe('SAN integration - RFI test', () => {
    /**
     * RFI - Complete an RFI against an offender who does not have any WIP OASys assessment
     * Then create an OASys-SAN assessment - ensure the RFI has now been associated with the 
     * assessment and is visible and available (read only) from the left hand navigation menu.
     */

    it('RFI test', () => {

        oasys.login(oasys.Users.probSanUnappr)

        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Create RFI

            const rfi = oasys.Nav.goto(oasys.Pages.Offender.Rfi)
            // const rfi = new oasys.Pages.Offender.Rfi().goto()
            rfi.typeOfRfi.setValue('Ad Hoc')
            rfi.internalUser.setValue(oasys.Users.probSanUnappr.lovLookup)
            rfi.reasonForRequest.setValue('Review')
            rfi.complete.click()

            // Create assessment
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            const assRfis = new oasys.Pages.Assessment.Rfis().goto()

            assRfis.rfis.checkCount(1)
            assRfis.rfis.clickFirstRow()
            rfi.save.checkStatus('notVisible')
            cy.log('Checked readonly (save button not visible)')
            oasys.Nav.clickButton('Close')
            oasys.Nav.clickButton('Close')

            oasys.logout()
        })
    })
})
