import * as oasys from 'oasys'

describe('SAN integration - test ref 13 part 2', () => {

    it('Test ref 13 - Another 3.2 assessment in pilot area', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)


            cy.log(`With the latest assessment being a completed 3.2, open it up and use the Admin option 'Mark assessments as historic'.
                    The offender record is showing the <Open Strengths and Needs> button.  Click on it.  
                    The Assessor is taken into the SAN Service and sees the latest SAN Assessment BUT it is in READ ONLY mode 
                    (this is because the latest OASys-SAN assessment is now historic).  
                    Return back to the Offender record in OASys.`)

            oasys.login(oasys.Users.admin, oasys.Users.probationSan)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            oasys.Assessment.openLatest()
            new oasys.Pages.Assessment.Other.MarkAssessmentHistoric().goto().ok.click()
            oasys.logout()

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.openLatest()

            oasys.San.gotoSanReadOnly('Accommodation','information')
            oasys.San.checkSanEditMode(false)
            oasys.San.returnToOASys()
            oasys.Nav.clickButton('Close')
            oasys.logout()
        })
    })
})