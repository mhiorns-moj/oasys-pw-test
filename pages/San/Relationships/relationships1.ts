import * as SanElement from 'classes/san/sanElements'
import { BaseSanEditPage } from '../baseSanEditPage'

export class Relationships1 extends BaseSanEditPage {

    name = 'Relationships1'
    title = 'Personal relationships and community - Strengths and Needs'

    anyChildren = new SanElement.CheckboxGroup<'yesLiveWith' | 'yesLiveElsewhere' | 'yesVisitRegularly' | 'no'>('#personal_relationships_community_children_details', ['yesLiveWith', 'yesLiveElsewhere', 'yesVisitRegularly', '-', 'no'])
}

