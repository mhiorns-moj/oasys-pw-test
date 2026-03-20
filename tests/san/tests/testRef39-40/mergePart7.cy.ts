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


    it('Merge tests part 7 - check assessments on offender 2, and create a new one', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender2').then((offenderData) => {
            const offender2 = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)

            oasys.Offender.searchAndSelectByCrn(offender2.probationCrn)
            const assesmentTab = new oasys.Pages.Offender.AssessmentsTab()
            assesmentTab.assessments.checkData([{ name: 'purposeOfAssessment', values: ['Review (Full) ', 'Start of Suspended Sentence Order (Full) '] }])

            // Check first assessment
            assesmentTab.assessments.purposeOfAssessment.clickRowContaining('Start of Suspended Sentence Order (Full) ')
            oasys.San.gotoSanReadOnly('Offence analysis')
            oasys.San.checkReadonlyText('Enter a brief description of the current index offence(s)', 'Offence description modified for offender 2')
            oasys.San.returnToOASys()
            oasys.Nav.clickButton('Close')

            // Check second assessment
            oasys.Assessment.openLatest()
            oasys.San.gotoSanReadOnly('Offence analysis')
            oasys.San.checkReadonlyText('Enter a brief description of the current index offence(s)', 'Offence description modified for 3rd assessment on merged offender')
            oasys.San.returnToOASys()
            oasys.Nav.clickButton('Close')

            oasys.Assessment.createProb({ purposeOfAssessment: 'Review' })
            oasys.San.gotoSan('Offence analysis')
            oasys.San.checkReadonlyText('Enter a brief description of the current index offence(s)', 'Offence description modified for 3rd assessment on merged offender')
            oasys.San.returnToOASys()
            oasys.logout()
        })
    })
})