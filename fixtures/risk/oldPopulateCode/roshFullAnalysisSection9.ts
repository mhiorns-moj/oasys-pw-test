
async populateFull(maxStrings: boolean = false) {

    await this.goto(true)
        .Rosh.RoshFullAnalysisSection9().goto(true)
    await this.escapeAnalysis.setValue(maxStrings ? utils.oasysString(4000) : 'EscapeAnalysis')
    await this.disruptionTrustAnalysis.setValue(maxStrings ? utils.oasysString(4000) : 'DisruptionTrustAnalysis')
}
