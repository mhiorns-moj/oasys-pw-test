

export function objective1(maxStrings: boolean = false) {

    const page = new oasys.Pages.SentencePlan.ObjectivesAndActions().goto(true)

    page.objectiveCategory.setValue('DRUG MISUSE')
    page.objective.setValue('Reduced harm to self')
    page.description.setValue(maxStrings ? utils.oasysString(4000) : 'Objective description')
    page.relevantOasysItem1.setValue('Drug misuse (including motivation to tackle drug misuse)')
    page.relevantOasysItem2.setValue('No Criminogenic Need')
    page.relevantOasysItem3.setValue('Risk to public')
    page.relevantOasysItem4.setValue('Risk to staff')
    page.measureProgress.setValue(maxStrings ? utils.oasysString(4000) : 'Objective 1 progress measure')
    page.objectiveStatus.setValue('Not Started')
    page.objectiveStatusComments.setValue(maxStrings ? utils.oasysString(4000) : 'Objective status comments')
    page.action.setValue('Drugs advocacy')
    page.actionDescription.setValue(maxStrings ? utils.oasysString(4000) : 'Action description')
    page.who1.setValue('Partnership Agency')
    page.whoComments1.setValue(maxStrings ? utils.oasysString(512) : 'Who does action 1')
    page.who2.setValue('Psychologist')
    page.whoComments2.setValue(maxStrings ? utils.oasysString(512) : 'Who does action 2')
    page.who3.setValue('Probation Staff')
    page.whoComments3.setValue(maxStrings ? utils.oasysString(512) : 'Who does action 3')
    page.timescale.setValue('One Month')
    page.actionStatus.setValue('Not Started')
    page.actionStatusComments.setValue(maxStrings ? utils.oasysString(4000) : 'Action status comments')

    page.save.click()
    page.close.click()
}

export function objective2(maxStrings: boolean = false) {

    const page = new oasys.Pages.SentencePlan.ObjectivesAndActions().goto(true)

    page.objectiveCategory.setValue('GAMBLING')
    page.objective.setValue('Increased motivation to take positive action')
    page.description.setValue(maxStrings ? utils.oasysString(4000) : 'Objective 2 description')
    page.relevantOasysItem1.setValue('Money management')
    page.measureProgress.setValue(maxStrings ? utils.oasysString(4000) : 'Objective 2 progress measure')
    page.objectiveStatus.setValue('Not Started')
    page.objectiveStatusComments.setValue(maxStrings ? utils.oasysString(4000) : 'Objective 2 status comments')
    page.action.setValue('Enhanced Thinking Skills (ETS)')
    page.actionDescription.setValue(maxStrings ? utils.oasysString(4000) : 'Action 2 description')
    page.who1.setValue('Offender')
    page.whoComments1.setValue(maxStrings ? utils.oasysString(512) : 'Who does second action 1')
    page.who2.setValue('Other Government Agency')
    page.whoComments2.setValue(maxStrings ? utils.oasysString(512) : 'Who does second action 2')
    page.who3.setValue('Prison Staff')
    page.whoComments3.setValue(maxStrings ? utils.oasysString(512) : 'Who does second action 3')
    page.timescale.setValue('One Month')
    page.actionStatus.setValue('Not Started')
    page.actionStatusComments.setValue(maxStrings ? utils.oasysString(4000) : 'Action 2 status comments')

    page.save.click()
    page.close.click()
}