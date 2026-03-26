
async populateFull(maxStrings: boolean = false) {

    await this.goto(true)
        .Rosh.RoshFullAnalysisSection62().goto(true)
    await this.harmfulBehaviours.setValue(maxStrings ? utils.oasysString(4000) : '6.2 Harmful behaviours')
    await this.behaviourPatterns.setValue(maxStrings ? utils.oasysString(4000) : '6.2 Patterns of behaviour')
}
