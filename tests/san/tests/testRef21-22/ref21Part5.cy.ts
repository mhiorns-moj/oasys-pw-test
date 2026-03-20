import * as oasys from 'oasys'
import * as testData from '../../data/testRef21'

describe('SAN integration - test ref 21 part 5', () => {

    it('Test ref 21 part 5 - create assessment on merged offender', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender2').then((offenderData) => {

            const offender2: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)
            oasys.Offender.searchAndSelectByPnc(offender2.pnc)

            // Create and complete assessment 8 (layer 3 v2)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.San.gotoSan()
            oasys.San.populateSanSections('Test ref 21', testData.assessment7)
            oasys.San.returnToOASys()
            new oasys.Pages.Rosh.RoshScreeningSection2to4().goto().rationale.setValue('Because')
            new oasys.Pages.SentencePlan.SentencePlanService().goto()
            oasys.Assessment.signAndLock({ expectRsrWarning: true })

            oasys.logout()

        })
    })
})