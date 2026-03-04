import * as oasys from 'oasys'

export function fullyPopulated(params?: PopulateAssessmentParams) {

    const page = new oasys.Pages.Rosh.RoshFullAnalysisSection8().goto(true)
    page.suicideSelfHarm.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'SuicideHarmDetails')
    page.custodyAnalysis.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'CustodyDetails')
    page.vulnerabilityAnalysis.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'VulnerabilityDetails')
    page.roshOthers.setValue('Yes')
    page.riskDetails.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'RiskDetails')
}
