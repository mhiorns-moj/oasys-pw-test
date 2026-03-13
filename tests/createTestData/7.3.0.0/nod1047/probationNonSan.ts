import * as oasys from 'lib'
import * as offenders from './offenderList'

describe('Create probation assessments (non-SAN)', () => {

    // it('WIP asssesments', () => {
    //     createProbWipAssessments(offenders.offendersSet1)
    //     createProbWipAssessments(offenders.offendersSet2)
    // })

    // it('Completed asssesments set 1 offender 3', () => {
    //     createProbCompletedAssessments3(offenders.offendersSet1)
    // })

    it('Completed asssesments set 2 offender 3', () => {
        createProbCompletedAssessments3(offenders.offendersSet2)
    })
    
    // it('Completed asssesments set 1 offender 4', () => {
    //     createProbCompletedAssessments4(offenders.offendersSet1)
    // })

    it('Completed asssesments set 2 offender 4', () => {
        createProbCompletedAssessments4(offenders.offendersSet2)
    })
    
    // it('Completed asssesments set 1 offender 5', () => {
    //     createProbCompletedAssessments5(offenders.offendersSet1)
    // })

    it('Completed asssesments set 2 offender 5', () => {
        createProbCompletedAssessments5(offenders.offendersSet2)
    })
    
    // it('Completed asssesments set 1 offender 6', () => {
    //     createProbCompletedAssessments6(offenders.offendersSet1)
    // })

    it('Completed asssesments set 2 offender 6', () => {
        createProbCompletedAssessments6(offenders.offendersSet2)
    })
})

function createProbWipAssessments(offenders: { surname: string, forename: string }[]) {

    oasys.login(oasys.Users.probHeadPdu)

    // Offender 1 - layer 1, minimal to complete but with discharge address etc, PoS, Facility Licence Eligability Date and Level of Healthcare Required
    oasys.Offender.searchAndSelectByName(offenders[0].surname)
    oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
    oasys.Populate.minimal({ layer: 'Layer 1' })
    populateTestDetails()
    oasys.Nav.clickButton('Close')

    // Offender 2 - layer 3 RSP, minimal to complete but with discharge address etc, PoS, Facility Licence Eligability Date and Level of Healthcare Required
    oasys.Offender.searchAndSelectByName(offenders[1].surname)
    oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'Review' })
    oasys.Populate.minimal({ layer: 'Layer 3', sentencePlan: 'Review' })
    populateTestDetails()
    oasys.Populate.Layer3Pages.Section13.fullyPopulated()
    oasys.Populate.rspFullyPopulated({})
    oasys.Nav.clickButton('Close')

    oasys.logout()
}

function createProbCompletedAssessments3(offenders: { surname: string, forename: string }[]) {

    oasys.login(oasys.Users.probHeadPdu)

    // Offender 3 - first assessment, fully completed ISP, high risk, including objectives
    oasys.Offender.searchAndSelectByName(offenders[2].surname)
    oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'Initial' })

    oasys.Populate.CommonPages.OffendingInformation.minimal()
    oasys.Populate.Layer3Pages.Predictors.minimal()
    oasys.Populate.sections2To13NoIssues()
    oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
    oasys.Populate.Rosh.specificRiskLevel('High')
    oasys.Populate.ispFullyPopulated({})
    oasys.Assessment.signAndLock({ expectRsrWarning: true })

    oasys.logout()
}

function createProbCompletedAssessments4(offenders: { surname: string, forename: string }[]) {

    oasys.login(oasys.Users.probHeadPdu)

    // Offender 4 - two assessments, second is fully completed RSP, high risk, including objectives
    oasys.Offender.searchAndSelectByName(offenders[3].surname)
    oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'Initial' })

    oasys.Populate.CommonPages.OffendingInformation.minimal()
    oasys.Populate.Layer3Pages.Predictors.minimal()
    oasys.Populate.sections2To13NoIssues()
    oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
    oasys.Populate.Rosh.specificRiskLevel('High')
    oasys.Populate.ispFullyPopulated({})
    oasys.Assessment.signAndLock({ expectRsrWarning: true })

    oasys.Nav.history(offenders[3].surname, offenders[3].forename)
    oasys.Assessment.createProb({ purposeOfAssessment: 'Review' })
    oasys.Populate.rspFullyPopulated({})
    oasys.Assessment.signAndLock({ expectRsrWarning: true })

    oasys.logout()
}
function createProbCompletedAssessments5(offenders: { surname: string, forename: string }[]) {

    oasys.login(oasys.Users.probHeadPdu)

    // Offender 5 - first assessment, fully completed ISP, high risk, including objectives
    oasys.Offender.searchAndSelectByName(offenders[4].surname)
    oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'Initial' })

    oasys.Populate.CommonPages.OffendingInformation.minimal()
    oasys.Populate.Layer3Pages.Predictors.minimal()
    oasys.Populate.sections2To13NoIssues()
    oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
    oasys.Populate.Rosh.specificRiskLevel('Low')
    oasys.Populate.ispFullyPopulated({})
    oasys.Assessment.signAndLock({ expectRsrWarning: true })

    oasys.logout()
}

function createProbCompletedAssessments6(offenders: { surname: string, forename: string }[]) {

    oasys.login(oasys.Users.probHeadPdu)

    // Offender 6 - two assessments, second is fully completed RSP, high risk, including objectives
    oasys.Offender.searchAndSelectByName(offenders[5].surname)
    oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'Initial' })

    oasys.Populate.CommonPages.OffendingInformation.minimal()
    oasys.Populate.Layer3Pages.Predictors.minimal()
    oasys.Populate.sections2To13NoIssues()
    oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
    oasys.Populate.Rosh.specificRiskLevel('Low')
    oasys.Populate.ispFullyPopulated({})
    oasys.Assessment.signAndLock({ expectRsrWarning: true })

    oasys.Nav.history(offenders[5].surname, offenders[5].forename)
    oasys.Assessment.createProb({ purposeOfAssessment: 'Review' })
    oasys.Populate.rspFullyPopulated({})
    oasys.Assessment.signAndLock({ expectRsrWarning: true })


    oasys.logout()
}

function populateTestDetails() {

    // const offenderInfo = new oasys.Pages.Assessment.OffenderInformation().goto()
    // offenderInfo.dischargeAddressLine1.setValue('Discharge address 1')
    // offenderInfo.dischargeAddressLine2.setValue('Discharge address 2')
    // offenderInfo.dischargeAddressLine3.setValue('Discharge address 3')
    // offenderInfo.dischargeAddressLine4.setValue('Discharge address 4')
    // offenderInfo.dischargeAddressLine5.setValue('Discharge address 5')
    // offenderInfo.dischargeAddressLine6.setValue('Discharge address 6')
    // offenderInfo.dischargePostcode.setValue('W1A 1AA')
    // offenderInfo.dischargeTelephone.setValue('09876543210')

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