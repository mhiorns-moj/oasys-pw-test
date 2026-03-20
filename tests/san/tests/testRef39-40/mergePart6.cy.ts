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


    it('Merge tests part 6 - check assessment on offender 1, and create a new one', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender1').then((offenderData) => {
            const offender1 = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)

            oasys.Offender.searchAndSelectByCrn(offender1.probationCrn)
            const assesmentTab = new oasys.Pages.Offender.AssessmentsTab()
            assesmentTab.assessments.checkData([{ name: 'purposeOfAssessment', values: ['Start of Community Order (Full) '] }])

            oasys.Assessment.openLatest()
            oasys.San.gotoSanReadOnly('Offence analysis')
            oasys.San.checkReadonlyText('Enter a brief description of the current index offence(s)', 'Offence description for assessment 1')
            oasys.San.returnToOASys()
            oasys.Nav.clickButton('Close')

            // Create a new one, check cloning
            cy.get<AppConfig>('@appConfig').then((appConfig) => {
                if (!appConfig.probForceCrn) {
                    // Need to set PNC to avoid error creating assessment
                    new oasys.Pages.Offender.OffenderDetails().pnc.setValue(offender1.pnc)
                }
                oasys.Assessment.createProb({ purposeOfAssessment: 'Review' })
                oasys.San.gotoSan('Offence analysis')
                oasys.San.checkReadonlyText('Enter a brief description of the current index offence(s)', 'Offence description for assessment 1')
                oasys.San.returnToOASys()
                oasys.logout()
            })
        })
    })
})