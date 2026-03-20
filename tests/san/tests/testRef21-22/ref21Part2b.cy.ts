import * as oasys from 'oasys'
import * as testData from '../../data/testRef21'

describe('SAN integration - test ref 21 part 2b', () => {

    it('Test ref 21 part 2b - create assessments on offender 2', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender2').then((offenderData) => {

            cy.log(`Create these assessments in this order, doesn't matter what data is used, just need to get the assessments	
                FIRST - LAYER 1 V1 - oasys_set.cloned_from_previous_san_pk is NULL	
                SECOND - LAYER 3 v1 - oasys_set.cloned_from_previous_san_pk is NULL	
                THIRD - LAYER 3 v2 - oasys_set.cloned_from_previous_san_pk is NULL	
                Offender transfers to NON SAN pilot area	
                FOURTH - LAYER 3 v1 - oasys_set.cloned_from_previous_san_pk is SET to the PK of the THIRD assessment	
                Offender transfers back to SAN pilot area	
                FIFTH - LAYER 3 v2 - oasys_set.cloned_from_previous_san_pk is SET to the PK of the THIRD assessment	
                SIXTH - LAYER3 v2 - LAYER 3 v2 - oasys_set.cloned_from_previous_san_pk is SET to the PK of the FIFTH assessment`)

            const offender2: OffenderDef = JSON.parse(offenderData as string)


            // Create and complete assessment 5 (layer 3 v2)
            oasys.login(oasys.Users.probSanHeadPdu)
            oasys.Nav.history(offender2)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.San.gotoSan()
            oasys.San.populateSanSections('Test ref 21', testData.assessment5)
            oasys.San.returnToOASys()
            new oasys.Pages.Rosh.RoshScreeningSection2to4().goto().rationale.setValue('Because')
            new oasys.Pages.SentencePlan.SentencePlanService().goto()
            oasys.Assessment.signAndLock({ expectRsrWarning: true })

            // Create and complete assessment 6 (layer 3 v2)
            oasys.Nav.history(offender2)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.San.gotoSan()
            oasys.San.populateSanSections('Test ref 21', testData.assessment6)
            oasys.San.returnToOASys()
            new oasys.Pages.Rosh.RoshScreeningSection2to4().goto().rationale.setValue('Because')
            new oasys.Pages.SentencePlan.SentencePlanService().goto()
            oasys.Assessment.signAndLock({ expectRsrWarning: true })

            oasys.logout()

        })
    })
})
