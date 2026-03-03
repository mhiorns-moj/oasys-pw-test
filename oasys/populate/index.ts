import { User } from 'classes/user'

export * as Layer1Pages from './layer1Pages'
export * as RoshaPages from './roshaPages'
export * as Layer3Pages from './layer3Pages'
export * as CommonPages from './commonPages'
export * as RoshPages from './roshPages'
export * as SentencePlanPages from './sentencePlanPages'
export * from './populateAssessments'
export * as Rosh from './rosh'
export * as San from './san'
export * as Sara from './sara'

export type PopulateAssessmentParams = {

    layer?: Layer
    maxStrings?: boolean,
    provider?: Provider,
    sentencePlan?: SentencePlan,
    r1_30PrePopulated?: boolean,
    r1_41PrePopulated?: boolean,
    populate6_11?: 'Yes' | 'No',
    newSp?: boolean,
    user?: User,
}
