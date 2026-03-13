import * as oasys from 'lib'
import * as offenders from './offenderList'

describe('Create probation SAN assessments', () => {

    it('Probation asssesments', () => {
        createProbSanAssessments(offenders.offendersSet1)
        createProbSanAssessments(offenders.offendersSet2)
    })

})

function createProbSanAssessments(offenders: { surname: string, forename: string }[]) {

    oasys.login(oasys.Users.probSanHeadPdu)

    // Offender 7 - completed SAN but not signed, with details for "Any physical or mental health conditions - YES"
    oasys.Offender.searchAndSelectByName(offenders[6].surname)
    oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', includeSanSections: 'Yes' })

    const predictors = new oasys.Pages.Assessment.Predictors().goto(true)
    predictors.dateFirstSanction.setValue({ years: -2 })
    predictors.o1_32.setValue(2)
    predictors.o1_40.setValue(2)
    predictors.o1_29.setValue({ months: -1 })
    predictors.o1_30.setValue('No')
    predictors.o1_38.setValue({})

    oasys.San.gotoSan()
    oasys.San.populateSanSections('Example test', oasys.Populate.San.ExampleTest.sanPopulation1)
    oasys.San.returnToOASys()

    oasys.Populate.Rosh.screeningNoRisks(true)
    populateTestDetails()

    oasys.Nav.clickButton('Close')

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
    // offendingInfo.count.setValue(1)
    // offendingInfo.facilityLicenceEligibilityDate.setValue({ months: 18 })
    // offendingInfo.levelOfHealthcareRequired.setValue('Day cover full-time staff')
}