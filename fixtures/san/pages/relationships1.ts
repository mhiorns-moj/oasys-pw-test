import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'

export class Relationships1 extends BaseSanEditPage {

    name = 'Relationships1'
    title = 'Personal relationships and community - Strengths and Needs'

    anyChildren = new Element.CheckboxGroup<'yesLiveWith' | 'yesLiveElsewhere' | 'yesVisitRegularly' | 'no'>(this.page, '#personal_relationships_community_children_details', ['yesLiveWith', 'yesLiveElsewhere', 'yesVisitRegularly', '-', 'no'])
}

