import * as oasys from 'oasys'
import * as testData from '../../data/testRef21'

describe('SAN integration - test ref 21 part 2', () => {

    it('Test ref 21 part 2 - create assessments on offender 2', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender2').then((offenderData) => {

            log(`Create these assessments in this order, doesn't matter what data is used, just need to get the assessments	
                FIRST - LAYER 1 V1 - oasys_set.cloned_from_previous_san_pk is NULL	
                SECOND - LAYER 3 v1 - oasys_set.cloned_from_previous_san_pk is NULL	
                THIRD - LAYER 3 v2 - oasys_set.cloned_from_previous_san_pk is NULL	
                Offender transfers to NON SAN pilot area	
                FOURTH - LAYER 3 v1 - oasys_set.cloned_from_previous_san_pk is SET to the PK of the THIRD assessment	
                Offender transfers back to SAN pilot area	
                FIFTH - LAYER 3 v2 - oasys_set.cloned_from_previous_san_pk is SET to the PK of the THIRD assessment	
                SIXTH - LAYER3 v2 - LAYER 3 v2 - oasys_set.cloned_from_previous_san_pk is SET to the PK of the FIFTH assessment`)

            const offender2: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)  // No countersigning for this test
            oasys.Offender.searchAndSelectByPnc(offender2.pnc)

            // Create and complete assessment 1 (layer 1 v1)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })

            oasys.Populate.minimal({ layer: 'Layer 1', sentencePlan: 'SpService' })
            oasys.Assessment.signAndLock()

            // Create and complete assessment 2 (layer 3 v1)
            oasys.Offender.searchAndSelectByPnc(offender2.pnc)

            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'No' })

            oasys.Populate.sections2To13NoIssues({ populate6_11: 'No' })
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()

            new oasys.Pages.SentencePlan.SentencePlanService().goto()
            oasys.Assessment.signAndLock({ expectRsrWarning: true })

            // Create and complete assessment 3 (layer 3 v2)
            oasys.Nav.history(offender2)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.San.gotoSan()
            oasys.San.populateSanSections('Test ref 21', testData.assessment3)
            oasys.San.returnToOASys()

            new oasys.Pages.Rosh.RoshScreeningSection2to4().goto().rationale.setValue('Because')

            new oasys.Pages.SentencePlan.SentencePlanService().goto()
            oasys.Assessment.signAndLock({ expectRsrWarning: true })
            oasys.logout()

            // Transfer to Bedfordshire
            oasys.login(oasys.Users.probHeadPdu)
            oasys.Offender.searchAndSelectByPnc(offender2.pnc, oasys.Users.probationSan)
            new oasys.Pages.Offender.OffenderDetails().requestTransfer.click()
            new oasys.Pages.Offender.RequestTransfer().submit.click()
            oasys.logout()

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Task.search({ taskName: 'Transfer Request Received - Decision Required', offenderName: offender2.surname })
            oasys.Task.selectFirstTask()
            new oasys.Pages.Tasks.TransferDecisionTask().grantTransfer.click()
            oasys.logout()


        })
    })
})
