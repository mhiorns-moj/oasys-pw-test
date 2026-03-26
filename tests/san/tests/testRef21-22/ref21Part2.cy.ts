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

            await oasys.login(oasys.users.probSanHeadPdu)  // No countersigning for this test
            await offender.searchAndSelectByPnc(offender2.pnc)

            // Create and complete assessment 1 (layer 1 v1)
            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })

            oasys.Populate.minimal({ layer: 'Layer 1', sentencePlan: 'SpService' })
            await signing.signAndLock()

            // Create and complete assessment 2 (layer 3 v1)
            await offender.searchAndSelectByPnc(offender2.pnc)

            await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'No' })

            oasys.Populate.sections2To13NoIssues({ populate6_11: 'No' })
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()

            new oasys.Pages.SentencePlan.SentencePlanService().goto()
            await signing.signAndLock({ expectRsrWarning: true })

            // Create and complete assessment 3 (layer 3 v2)
            await oasys.history(offender2)
            await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            await san.gotoSan()
            await san.populateSanSections('Test ref 21', testData.assessment3)
            await san.returnToOASys()

            new oasys.Pages.Rosh.RoshScreeningSection2to4().goto().rationale.setValue('Because')

            new oasys.Pages.SentencePlan.SentencePlanService().goto()
            await signing.signAndLock({ expectRsrWarning: true })
            await oasys.logout()

            // Transfer to Bedfordshire
            await oasys.login(oasys.users.probHeadPdu)
            await offender.searchAndSelectByPnc(offender2.pnc, oasys.users.probationSan)
            new oasys.Pages.Offender.OffenderDetails().requestTransfer.click()
            new oasys.Pages.Offender.RequestTransfer().submit.click()
            await oasys.logout()

            await oasys.login(oasys.users.probSanUnappr)
            await tasks.search({ taskName: 'Transfer Request Received - Decision Required', offenderName: offender2.surname })
            await tasks.selectFirstTask()
            new oasys.Pages.Tasks.TransferDecisionTask().grantTransfer.click()
            await oasys.logout()


        })
    })
})
