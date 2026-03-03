import * as oasys from 'oasys'
import * as offenders from './offenderList'

describe('Create prison SAN assessments', () => {

    it('Prison asssesments', () => {
        createPrisSanAssessments(offenders.offendersSet1)
        createPrisSanAssessments(offenders.offendersSet2)
    })
})

function createPrisSanAssessments(offenders: { surname: string, forename: string }[]) {

    oasys.login(oasys.Users.prisSanHomds)

    // Offender 14 - completed SAN but not signed, with details for "Any physical or mental health conditions - YES"
    oasys.Offender.searchAndSelectByName(offenders[13].surname)
    oasys.Assessment.createPris({ purposeOfAssessment: 'Start custody', includeSanSections: 'Yes' })

    populateTestDetails()
    oasys.Populate.Layer3Pages.Predictors.minimal()

    oasys.San.gotoSan()
    oasys.San.populateSanSections('NOD-1047', oasys.Populate.San.ExampleTest.sanPopulation1)
    oasys.San.returnToOASys()

    oasys.Populate.Rosh.screeningNoRisks(true)

    // Complete SP, then sign and lock
    // oasys.San.gotoSentencePlan()
    // oasys.San.populateSanSections('SAN sentence plan', oasys.Populate.San.SentencePlan.minimal)
    // oasys.San.returnToOASys()

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
    // offendingInfo.count.setValue(1)
    // offendingInfo.facilityLicenceEligibilityDate.setValue({ months: 18 })
    // offendingInfo.levelOfHealthcareRequired.setValue('Day cover full-time staff')
}