import * as oasys from 'lib'

/**
 * Populates risk screening sections 1 to 4 with no risks.  The optional parameter indicates that the Rationale (R2.3) is expected and should be populated.
 */
export function screeningNoRisks(withRationale: boolean = false) {

    log(`Populating screening no risks, withRationale = ${withRationale}`)
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

