import * as oasys from 'lib'

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Rosh.RoshFullAnalysisSection62().goto(true)
    page.harmfulBehaviours.setValue(maxStrings ? oasys.oasysString(4000) : '6.2 Harmful behaviours')
    page.behaviourPatterns.setValue(maxStrings ? oasys.oasysString(4000) : '6.2 Patterns of behaviour')
}
