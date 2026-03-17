import { OasysPage, Element } from 'classes'

export class PrintSentencePlan extends OasysPage {

    name = 'PrintSentencePlan'

    currentObjectivesColumn = new Element.Column(this.page, Element.ColumnType.Column, '#SECTION_NAME_R10389525023337893')
    includeColumn = new Element.Column(this.page, Element.ColumnType.CheckboxColumn, '#CHECK_BOX_R10389525023337893')
    print = new Element.Button(this.page, 'Print')
    cancel = new Element.Button(this.page, 'Cancel')
}
