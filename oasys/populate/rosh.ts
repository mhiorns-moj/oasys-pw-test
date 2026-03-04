import * as oasys from 'oasys'

/**
 * Populates risk screening sections 1 to 4 with no risks.  The optional parameter indicates that the Rationale (R2.3) is expected and should be populated.
 */
export function screeningNoRisks(withRationale: boolean = false) {

    cy.log(`Populating screening no risks, withRationale = ${withRationale}`)
    oasys.Populate.RoshPages.RoshScreeningSection1.noRisks()
    oasys.Populate.RoshPages.RoshScreeningSection2to4.noRisks(withRationale)
    oasys.Populate.RoshPages.RoshScreeningSection5.noRisks()
}

export function screeningFullyPopulated(params: PopulateAssessmentParams) {

    oasys.Populate.RoshPages.RoshScreeningSection1.fullyPopulated(params)
    if (params.layer == 'Layer 3') {
        new oasys.Pages.Rosh.RoshScreeningSection1().next.click()     // Trigger SARA prompt
        oasys.Populate.RoshPages.cancelSara()
    }
    oasys.Populate.RoshPages.RoshScreeningSection2to4.fullyPopulated()
    oasys.Populate.RoshPages.RoshScreeningSection5.fullyPopulated()
}

export function fullAnalysisFullyPopulated(params: PopulateAssessmentParams) {

    oasys.Populate.RoshPages.RoshFullAnalysisSection62.fullyPopulated(params.maxStrings)
    oasys.Populate.RoshPages.RoshFullAnalysisSection7.fullyPopulated(params.maxStrings)
    oasys.Populate.RoshPages.RoshFullAnalysisSection8.fullyPopulated(params)
    oasys.Populate.RoshPages.RoshFullAnalysisSection9.fullyPopulated(params.maxStrings)
    oasys.Populate.RoshPages.RoshSummary.fullyPopulated(params.maxStrings)
    oasys.Populate.RoshPages.RiskManagementPlan.fullyPopulated(params)
}

/**
 * Enters minimum Rosh screening responses but with R1.2.1P set to Yes to get full analysis.
 * Sets risk flags to the risk level specified, and enters some basic text on risk summary and RMP.
 */
export function specificRiskLevel(risk: RiskLevel, withRationale: boolean = false) {

    oasys.Populate.RoshPages.RoshScreeningSection1.noRisks()
    new oasys.Pages.Rosh.RoshScreeningSection1().goto(true).r1_2_1P.setValue('Yes')
    oasys.Populate.RoshPages.RoshScreeningSection2to4.noRisks(withRationale)

    const page = new oasys.Pages.Rosh.RoshSummary().goto(true)
    page.r10_1.setValue('R10.1 details')
    page.r10_2.setValue('R10.2 details')
    page.riskFactorAnslysis.setValue('Risk factor analysis')
    page.r10_5.setValue('R10.5 details')
    page.r10_3.setValue('R10.3 details')
    page.r10_6ChildrenCommunity.setValue(risk)
    page.r10_6ChildrenCustody.setValue(risk)
    page.r10_6PublicCommunity.setValue(risk)
    page.r10_6PublicCustody.setValue(risk)
    page.r10_6AdultCommunity.setValue(risk)
    page.r10_6AdultCustody.setValue(risk)
    page.r10_6StaffCommunity.setValue(risk)
    page.r10_6StaffCustody.setValue(risk)
    page.r10_6PrisonersCustody.setValue(risk)

    if (risk != 'Low') {
        oasys.Populate.RoshPages.RiskManagementPlan.minimalWithTextFields()
    }
}