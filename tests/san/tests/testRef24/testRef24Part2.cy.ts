import * as oasys from 'oasys'

describe('SAN integration - test ref 24', () => {

    it('Test ref 24 part 2', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)


            cy.log(`Log back in again as a User in the same probation region who has the SAN Service role but is NOT on the LAO readers list
                    Search for and open the LAO offender record - the user ONLY has LAO boilerplate (all read only and just access to the 'alias' tab)
                    The only buttons on the offender banner is <RFI> and <Close>.  There are NO buttons for 'Open S&N' or 'Open SP'
                    Log out`)

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            const offenderDetails = new oasys.Pages.Offender.OffenderDetails()

            offenderDetails.pnc.checkStatus('readonly')
            offenderDetails.assessmentsTab.checkStatus('notVisible')
            offenderDetails.createAssessment.checkStatus('notVisible')
            offenderDetails.openSan.checkStatus('notVisible')
            offenderDetails.openSp.checkStatus('notVisible')
            oasys.logout()

            cy.log(`Log back in again as a User in the same probation region who does NOT have the SAN Service role and is NOT on the LAO readers list
                    Search for and open the LAO offender record - the user ONLY has LAO boilerplate (all read only and just access to the 'alias' tab)
                    The only buttons on the offender banner is <RFI> and <Close>.  There are NO buttons for 'Open S&N' or 'Open SP'`)

            oasys.login(oasys.Users.admin, oasys.Users.probationSan)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            offenderDetails.pnc.checkStatus('readonly')
            offenderDetails.assessmentsTab.checkStatus('notVisible')
            offenderDetails.createAssessment.checkStatus('notVisible')
            offenderDetails.openSan.checkStatus('notVisible')
            offenderDetails.openSp.checkStatus('notVisible')
            oasys.logout()
        })
    })

})
