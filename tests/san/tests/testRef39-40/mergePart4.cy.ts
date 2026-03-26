import * as oasys from 'oasys'
import * as testData from '../../data/mergeTest'

describe('SAN integration - tests 39-40', () => {
    /**
     * Merge - where BOTH offenders have OASys-SAN assessments
     * Merge two offenders where BOTH of the offenders have OASys-SAN assessments - check it posts the correct MERGE API
     * 
     * De-merge - where BOTH offenders have OASys-SAN assessments
     * Using the offender who was previously merged in this situation, create and complete a new OASys-SAN assessment.
     * The carry out a De-merge - check it posts the correct MERGE API
     */

    it('Merge tests part 4 - create and complete another 3.2 assessment on the merged offender', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender2').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            await oasys.login(oasys.users.probSanHeadPdu)  // Senior user so no countersigning for this test
            await offender.searchAndSelectByPnc(offender.pnc)

            // Create assessment
            await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            await san.gotoSan()
            await san.populateSanSections('Merge test', testData.modifySanForAssessment3)
            await san.returnToOASys()

            // Sign and lock
            new oasys.Pages.SentencePlan.SentencePlanService().goto()
            await signing.signAndLock()
            await oasys.logout()
        })
    })
})
