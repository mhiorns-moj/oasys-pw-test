import * as oasys from 'lib'

describe('SAN integration - test ref 48 part 1', () => {

    it('Test ref 48 part 1', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            cy.log(`Offender has a previous historic period of supervision where latest assessment is a 3.1 classic OASys`)

            // Create and complete layer 3
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'No' })
            oasys.Populate.minimal({ layer: 'Layer 3', populate6_11: 'No' })
            new oasys.Pages.SentencePlan.IspSection1to4().goto()
            oasys.Assessment.signAndLock({ expectRsrWarning: true })

            // Make historic
            oasys.Nav.history()
            new oasys.Pages.Assessment.Other.MarkAssessmentHistoric().goto().ok.click()

            cy.log(`Has a current period of supervision where the only assessment is a Layer 1 V1`)
            // Create and complete layer 1

            oasys.Nav.clickButton('Close')
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' }, 'No')
            oasys.Populate.minimal({ layer: 'Layer 1' })
            new oasys.Pages.SentencePlan.BasicSentencePlan().goto()
            oasys.Assessment.signAndLock()

            cy.log(`Assessor creates a 3.2 assessment - does NOT get asked whether they wish to clone section 3 to 13 and sentence plan question (improved cloning)`)

            oasys.Nav.history(offender)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

            // Check that the assessment has created without an additional prompt
            new oasys.Pages.Assessment.OffenderInformation().checkCurrent()

            oasys.logout()
        })
    })
})