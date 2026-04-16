import * as ObjectivesAndActions from './objectivesAndActions'


export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.SentencePlan.IspSection5().goto(true)
    ObjectivesAndActions.objective1(maxStrings)
    ObjectivesAndActions.objective2(maxStrings)
}
