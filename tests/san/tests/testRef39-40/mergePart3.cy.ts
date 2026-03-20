import * as oasys from 'oasys'

describe('SAN integration - tests 39-40', () => {
    /**
     * Merge - where BOTH offenders have OASys-SAN assessments
     * Merge two offenders where BOTH of the offenders have OASys-SAN assessments - check it posts the correct MERGE API
     * 
     * De-merge - where BOTH offenders have OASys-SAN assessments
     * Using the offender who was previously merged in this situation, create and complete a new OASys-SAN assessment.
     * The carry out a De-merge - check it posts the correct MERGE API
     */

    it('Merge tests part 3 - merge offenders', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender1').then((offenderData) => {
            const offender1 = JSON.parse(offenderData as string)
            cy.task('retrieveValue', 'offender2').then((offenderData) => {
                const offender2 = JSON.parse(offenderData as string)

                // Get original assessment PKs
                oasys.Db.getAllSetPksByProbationCrn(offender1.probationCrn, 'oldPksOff1')
                oasys.Db.getAllSetPksByProbationCrn(offender2.probationCrn, 'oldPksOff2')
                oasys.login(oasys.Users.probSanHeadPdu)
                oasys.Offender.searchAndSelectByPnc(offender1.pnc)

                // Set the PNC to trigger a merge
                const offenderDetails = new oasys.Pages.Offender.OffenderDetails()
                offenderDetails.pnc.setValue(offender2.pnc) // Cypress will automatically OK the alert
                offenderDetails.save.click()
                new oasys.Pages.Tasks.TaskManager().goto()
                oasys.Task.grantMerge(offender2.surname)

                // Get new assessment PKs
                oasys.Db.getAllSetPksByProbationCrn(offender1.probationCrn, 'newPksOff1')
                oasys.Db.getAllSetPksByProbationCrn(offender2.probationCrn, 'newPksOff2')
                oasys.San.checkSanMergeCall(oasys.Users.probSanHeadPdu, 3)
                oasys.logout()
            })
        })
    })
})