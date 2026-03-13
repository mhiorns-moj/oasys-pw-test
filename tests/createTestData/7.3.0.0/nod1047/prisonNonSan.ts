import * as oasys from 'lib'
import * as offenders from './offenderList'


describe('Create prison assessments (non-SAN)', () => {

    it('WIP asssesments', () => {
        createPrisWipAssessments(offenders.offendersSet1)
        createPrisWipAssessments(offenders.offendersSet2)
    })

    it('Completed asssesments set 1 offender 10', () => {
        createPrisCompletedAssessments10(offenders.offendersSet1)
    })

    it('Completed asssesments set 2 offender 10', () => {
        createPrisCompletedAssessments10(offenders.offendersSet2)
    })
    
    it('Completed asssesments set 1 offender 11', () => {
        createPrisCompletedAssessments11(offenders.offendersSet1)
    })

    it('Completed asssesments set 2 offender 11', () => {
        createPrisCompletedAssessments11(offenders.offendersSet2)
    })
    
    it('Completed asssesments set 1 offender 12', () => {
        createPrisCompletedAssessments12(offenders.offendersSet1)
    })

    it('Completed asssesments set 2 offender 12', () => {
        createPrisCompletedAssessments12(offenders.offendersSet2)
    })
    
    it('Completed asssesments set 1 offender 13', () => {
        createPrisCompletedAssessments13(offenders.offendersSet1)
    })

    it('Completed asssesments set 2 offender 13', () => {
        createPrisCompletedAssessments13(offenders.offendersSet2)
    })

})

function createPrisWipAssessments(offenders: { surname: string, forename: string }[]) {

    oasys.login(oasys.Users.prisHomds)

    // Offender 8 - layer 1, minimal to complete but with discharge address etc, PoS, Facility Licence Eligability Date and Level of Healthcare Required
    oasys.Offender.searchAndSelectByName(offenders[7].surname)
    oasys.Assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Basic (Layer 1)' })
    oasys.Populate.minimal({ layer: 'Layer 1' })
    populateTestDetails()
    oasys.Nav.clickButton('Close')

    // Offender 9 - layer 3 RSP, minimal to complete but with discharge address etc, PoS, Facility Licence Eligability Date and Level of Healthcare Required
    oasys.Offender.searchAndSelectByName(offenders[8].surname)
    oasys.Assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'Review' })
    oasys.Populate.minimal({ layer: 'Layer 3', sentencePlan: 'Review' })
    populateTestDetails()
    oasys.Populate.Layer3Pages.Section13.fullyPopulated()
    oasys.Populate.rspFullyPopulated({})
    oasys.Nav.clickButton('Close')

    oasys.logout()
}

function createPrisCompletedAssessments10(offenders: { surname: string, forename: string }[]) {

    oasys.login(oasys.Users.prisHomds)

    // Offender 10 - first assessment, fully completed ISP, high risk, including objectives
    oasys.Offender.searchAndSelectByName(offenders[9].surname)
    oasys.Assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'Initial' })

    oasys.Populate.CommonPages.OffendingInformation.minimal()
    oasys.Populate.Layer3Pages.Predictors.minimal()
    oasys.Populate.sections2To13NoIssues()
    oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
    oasys.Populate.Rosh.specificRiskLevel('High')
    new oasys.Pages.Rosh.RiskManagementPlan().goto().r11_13.setValue('Automatic early allocation')
    oasys.Populate.ispFullyPopulated({})
    oasys.Assessment.signAndLock({ expectRsrWarning: true })

    oasys.logout()
}

function createPrisCompletedAssessments11(offenders: { surname: string, forename: string }[]) {

    oasys.login(oasys.Users.prisHomds)

    // Offender 11 - two assessments, second is fully completed RSP, high risk, including objectives
    oasys.Offender.searchAndSelectByName(offenders[10].surname)
    oasys.Assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'Initial' })

    oasys.Populate.CommonPages.OffendingInformation.minimal()
    oasys.Populate.Layer3Pages.Predictors.minimal()
    oasys.Populate.sections2To13NoIssues()
    oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
    oasys.Populate.Rosh.specificRiskLevel('High')
    new oasys.Pages.Rosh.RiskManagementPlan().goto().r11_13.setValue('Automatic early allocation')
    oasys.Populate.ispFullyPopulated({})
    oasys.Assessment.signAndLock({ expectRsrWarning: true })

    oasys.Nav.history(offenders[10].surname, offenders[10].forename)
    oasys.Assessment.createPris({ purposeOfAssessment: 'Review' })
    oasys.Populate.rspFullyPopulated({})
    oasys.Assessment.signAndLock({ expectRsrWarning: true })

    oasys.logout()
}

function createPrisCompletedAssessments12(offenders: { surname: string, forename: string }[]) {

    oasys.login(oasys.Users.prisHomds)

    // Offender 12 - first assessment, fully completed ISP, high risk, including objectives
    oasys.Offender.searchAndSelectByName(offenders[11].surname)
    oasys.Assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'Initial' })

    oasys.Populate.CommonPages.OffendingInformation.minimal()
    oasys.Populate.Layer3Pages.Predictors.minimal()
    oasys.Populate.sections2To13NoIssues()
    oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
    oasys.Populate.Rosh.specificRiskLevel('Low')
    new oasys.Pages.Rosh.RiskManagementPlan().goto().r11_13.setValue('Automatic early allocation')
    oasys.Populate.ispFullyPopulated({})
    oasys.Assessment.signAndLock({ expectRsrWarning: true })

    oasys.logout()
}

function createPrisCompletedAssessments13(offenders: { surname: string, forename: string }[]) {

    oasys.login(oasys.Users.prisHomds)

    // Offender 13 - two assessments, second is fully completed RSP, high risk, including objectives
    oasys.Offender.searchAndSelectByName(offenders[12].surname)
    oasys.Assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'Initial' })

    oasys.Populate.CommonPages.OffendingInformation.minimal()
    oasys.Populate.Layer3Pages.Predictors.minimal()
    oasys.Populate.sections2To13NoIssues()
    oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
    oasys.Populate.Rosh.specificRiskLevel('Low')
    new oasys.Pages.Rosh.RiskManagementPlan().goto().r11_13.setValue('Automatic early allocation')
    oasys.Populate.ispFullyPopulated({})
    oasys.Assessment.signAndLock({ expectRsrWarning: true })

    oasys.Nav.history(offenders[12].surname, offenders[12].forename)
    oasys.Assessment.createPris({ purposeOfAssessment: 'Review' })
    oasys.Populate.rspFullyPopulated({})
    oasys.Assessment.signAndLock({ expectRsrWarning: true })

    oasys.logout()
}

function populateTestDetails() {

    // const proposal = new oasys.Pages.Assessment.ProposalInformation().goto()
    // proposal.purpose0.setValue(true)
    // proposal.purpose1.setValue(true)
    // proposal.purpose2.setValue(true)
    // proposal.purpose3.setValue(true)
    // proposal.purpose4.setValue(true)
    // proposal.purpose5.setValue(true)

    // const offendingInfo = new oasys.Pages.Assessment.OffendingInformation().goto()
    // offendingInfo.facilityLicenceEligibilityDate.setValue({ months: 18 })
    // offendingInfo.levelOfHealthcareRequired.setValue('Day cover full-time staff')
}