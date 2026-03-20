import * as oasys from 'oasys'

describe('SAN integration - test ref 13 part 0', () => {

    it('Test ref 13 - Another 3.2 assessment in pilot area', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)


            cy.log(`Log in as an Assessor that has the SAN function to the PILOT probation area
                    Open up the offender record from Test Ref 12.  Transfer the offender back to the SAN PILOT probation area.
                    Create a new 'review' assessment electing to use the SAN which has defaulted to NULL.`)

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc, oasys.Users.probationNonSan)
            new oasys.Pages.Offender.OffenderDetails().requestTransfer.click()
            new oasys.Pages.Offender.RequestTransfer().submit.click()
            oasys.logout()
            oasys.login(oasys.Users.probHeadPdu)
            oasys.Task.search({ taskName: 'Transfer Request Received - Decision Required', offenderName: offender.surname })
            oasys.Task.selectFirstTask()
            new oasys.Pages.Tasks.TransferDecisionTask().grantTransfer.click()
            oasys.logout()

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            oasys.Assessment.getToCreateAssessmentPage()
            let createAssessmentPage = new oasys.Pages.Assessment.CreateAssessment()
            createAssessmentPage.purposeOfAssessment.setValue('Review')
            createAssessmentPage.includeSanSections.checkValue('')
            createAssessmentPage.includeSanSections.setValue('Yes')
            createAssessmentPage.create.click()
            oasys.Nav.clickButton('Close')
            oasys.logout()
        })
    })
})