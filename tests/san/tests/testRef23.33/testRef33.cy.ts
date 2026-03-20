import * as oasys from 'oasys'

describe('SAN integration - test ref 33', () => {

    /*
        Check to ensure user is NOT ALLowed to select FAST REVIEW if the previous assessment is an OASys-SAN assessment (3.2)
    */

    it('Test ref 33', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)
            oasys.Nav.history(offender)

            cy.log(`Go to Create a new Assessment
                Check that the 'Purpose of Assessment' field does NOT include 'Fast Review' in the drop downs`)

            oasys.Assessment.getToCreateAssessmentPage()
            new oasys.Pages.Assessment.CreateAssessment().purposeOfAssessment.checkOptionNotAvailable('Fast Review')
            oasys.logout()

        })
    })
})
