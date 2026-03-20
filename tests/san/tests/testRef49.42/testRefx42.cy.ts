import * as oasys from 'oasys'

describe('SAN integration - test ref 42', () => {

    it('Test ref 42', () => {

        /*
            Check functionality for the Fast Review POA 
        */

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)
            oasys.Nav.history(offender)

            cy.log(`Find a probation offender in the SAN PILOT AREA whose latest assessment is a Layer 3 Version 1
                Click on the <Create Assessment> button and go through the processing to land on the Create Assessment page
                Change the POA and select Fast Review`)

            oasys.Assessment.getToCreateAssessmentPage()
            const create = new oasys.Pages.Assessment.CreateAssessment()

            create.purposeOfAssessment.setValue('Fast Review')

            cy.log(`Select 'No' at Include strengths and needs sections? - Fast Review remains
                Change 'No' to 'Yes' screen refreshes and 'Fast Review' automatically changes to 'Review' - because you cannot action a FAST REVIEW for an OASys-SAN assessment`)

            create.includeSanSections.setValue('No')
            create.purposeOfAssessment.checkValue('Fast Review')
            create.includeSanSections.setValue('Yes')
            create.purposeOfAssessment.checkValue('Review')

            cy.log(`Now change the POA to Fast Review - the question is nulled out
                Try clicking on <Create> - get error msg`)

            create.purposeOfAssessment.setValue('Fast Review')
            create.includeSanSections.checkValue('')
            create.create.click()
            oasys.Errors.checkErrorMessage('You must decide if you want to include strengths and needs before being able to create the assessment.')

            cy.log(`Say No to the question
                Click on <Create>`)

            create.includeSanSections.setValue('No')
            create.create.click()

            cy.log(`Complete the Fast Review assessment`)

            oasys.Populate.Layer3Pages.FastReview.noChanges()
            new oasys.Pages.SentencePlan.SentencePlanService().goto()
            oasys.Assessment.signAndLock()

            cy.log(`Click on the <Create Assessment> button and go through the processing to land on the Create Assessment page - defaults POA to Fast Review
                Answer 'Yes' to the question - screen refreshes and changes 'Fast Review' to 'Review' and blanks out the question
                Answer Yes to the question
                Click on <Create> - now have an OASys-SAN assessment (3.2)`)

            oasys.Nav.history(offender)
            oasys.Assessment.getToCreateAssessmentPage()
            create.purposeOfAssessment.checkValue('Fast Review')
            create.includeSanSections.setValue('Yes')
            create.purposeOfAssessment.checkValue('Review')
            create.includeSanSections.checkValue('')
            create.includeSanSections.setValue('Yes')
            create.create.click()

            cy.log(`Complete the 3.2 assessment including sentence plan with whatever you like
                Click on the <Create Assessment> button and go through the processing to land on the Create Assessment page
                Ensure that the POA drop down list does NOT contain FAST REVIEW`)

            new oasys.Pages.Rosh.RoshScreeningSection2to4().goto().rationale.setValue('Some reason')
            new oasys.Pages.SentencePlan.SentencePlanService().goto()
            oasys.Assessment.signAndLock()

            oasys.Nav.history(offender)
            oasys.Assessment.getToCreateAssessmentPage()
            create.purposeOfAssessment.checkOptionNotAvailable('Fast Review')

            oasys.logout()

        })
    })
})
