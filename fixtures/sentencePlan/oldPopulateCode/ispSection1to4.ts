

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.SentencePlan.IspSection1to4().goto(true)
    page.capacity.setValue('Not at all')
    page.workToIncrease.setValue(maxStrings ? utils.oasysString(4000) : 'Work to increase motivation')
    page.inhibitingFactors.setValue(maxStrings ? utils.oasysString(4000) : 'Inhibiting factors')
    page.positiveFactors.setValue(maxStrings ? utils.oasysString(4000) : 'Postive factors')
    page.incentiveLevel.setValue('Basic')
    page.victimLocation.setValue('Yes')
    page.victimImpactAwareness.setValue(maxStrings ? utils.oasysString(4000) : 'Victim impact awareness')
    page.discriminationExperience.setValue(maxStrings ? utils.oasysString(4000) : 'Experience of discrimination')
    page.discriminatoryBehaviour.setValue(maxStrings ? utils.oasysString(4000) : 'Discriminatory behaviour')
}
