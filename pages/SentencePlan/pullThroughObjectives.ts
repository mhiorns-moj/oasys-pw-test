import { OasysPage, Element } from 'classes'

export class PullThroughObjectives extends OasysPage {

    name = 'PullThroughObjectives'
    title = 'Pull Through Objectives'

    ok = new Element.Button(this.page, 'OK')
    close = new Element.Button(this.page, 'Close')
    confirmation = new Element.Text(this.page, 'Objective(s) Successfully pulled through.')
    objectiveDescColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Objective Desc')
    selectColumn = new Element.Column(this.page, Element.ColumnType.CheckboxColumn, '')
}
