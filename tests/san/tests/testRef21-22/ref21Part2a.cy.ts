import * as oasys from 'oasys'

describe('SAN integration - test ref 21 part 2a', () => {

    it('Test ref 21 part 2a - create assessments on offender 2', () => {

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


            // Create and complete assessment 4 (layer 3 v1)
            oasys.login(oasys.users.probHeadPdu)
            oasys.Nav.history(offender2)

            await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
            oasys.Populate.sections2To13NoIssues()
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
            new oasys.Pages.SentencePlan.RspSection72to10().goto().agreeWithPlan.setValue('Yes')
            await signing.signAndLock({ expectRsrWarning: true })
            oasys.logout()

            // Transfer back to Durham
            oasys.login(oasys.users.probSanHeadPdu)
            oasys.Nav.history(offender2)
            new oasys.Pages.Offender.OffenderDetails().requestTransfer.click()
            new oasys.Pages.Offender.RequestTransfer().submit.click()
            oasys.logout()

            oasys.login(oasys.users.probHeadPdu)
            await tasks.search({ taskName: 'Transfer Request Received - Decision Required', offenderName: offender2.surname })
            await tasks.selectFirstTask()
            new oasys.Pages.Tasks.TransferDecisionTask().grantTransfer.click()
            oasys.logout()

        })
    })
})
