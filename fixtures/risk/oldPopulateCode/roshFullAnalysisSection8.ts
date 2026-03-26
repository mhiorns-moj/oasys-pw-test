
async populateFull(params ?: PopulateAssessmentParams) {

    await this.goto(true)
        .Rosh.RoshFullAnalysisSection8().goto(true)
    await this.suicideSelfHarm.setValue(params?.maxStrings ? utils.oasysString(4000) : 'SuicideHarmDetails')
    await this.custodyAnalysis.setValue(params?.maxStrings ? utils.oasysString(4000) : 'CustodyDetails')
    await this.vulnerabilityAnalysis.setValue(params?.maxStrings ? utils.oasysString(4000) : 'VulnerabilityDetails')
    await this.roshOthers.setValue('Yes')
    await this.riskDetails.setValue(params?.maxStrings ? utils.oasysString(4000) : 'RiskDetails')
}
