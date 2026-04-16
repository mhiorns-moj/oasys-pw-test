import { OasysPage, Element } from 'classes'
import { SentencePlan } from './sentencePlan'

export class RspSection3to63 extends SentencePlan {

    name = 'RSPSection3to63'
    title = 'Review Sentence Plan'
    menu: Menu = { type: 'Floating', level1: 'Review Sentence Plan', level2: 'Section 3 to 6.3' }

    motivation = new Element.Textbox(this.page, '#XI_itm_12_8')
    capacityChanged = new Element.Select(this.page, '#itm_RP_28')
    motivationSelect = new Element.Select(this.page, '#itm_RP_27')
    capacityChangedHow = new Element.Textbox(this.page, '#textarea_RP_29')
    discriminationWorkDone = new Element.Textbox(this.page, '#textarea_RP_38')
    discriminationWorkRequired = new Element.Textbox(this.page, '#textarea_RP_39')
    newProgramme = new Element.Button(this.page, 'New Programme')
    programmeColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Programme attended eg R& R')
    completedColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Completed')
    objectivesStatusColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Programme objectives fully achieved, partly achieved, not achieved')
    reportColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Report available')
    deleteColumn = new Element.Column(this.page, Element.ColumnType.ButtonColumn, 'Delete')
}
