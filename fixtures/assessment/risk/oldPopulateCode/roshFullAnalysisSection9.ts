import * as oasys from 'lib'

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Rosh.RoshFullAnalysisSection9().goto(true)
    page.escapeAnalysis.setValue(maxStrings ? oasys.oasysString(4000) : 'EscapeAnalysis')
    page.disruptionTrustAnalysis.setValue(maxStrings ? oasys.oasysString(4000) : 'DisruptionTrustAnalysis')
}
