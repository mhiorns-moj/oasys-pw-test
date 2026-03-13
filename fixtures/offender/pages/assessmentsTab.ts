import { OasysPage, Element } from 'classes'

export class AssessmentsTab extends OasysPage {

    name = 'AssessmentsTab'
    assessments = new AssessmentsTable(this.page, 'R5522906992105444', 'Assessments')
}

export class AssessmentsTable extends Element.Table {

    status = new Element.Column(this.page, Element.ColumnType.ImageColumn, `#ASSESSMENT_STATUS_ELM_${this.id}`, this.id)
    san = new Element.Column(this.page, Element.ColumnType.ImageColumn, `#SAN_${this.id}`, this.id)
    dateCompleted = new Element.Column(this.page, Element.ColumnType.Column, `#DATE_COMPLETE_${this.id}`, this.id)
    purposeOfAssessment = new Element.Column(this.page, Element.ColumnType.Column, `#PURPOSE_${this.id}`, this.id)
    lockAssessment = new Element.Column(this.page, Element.ColumnType.ButtonColumn, `#LOCKING_BUTTON_${this.id}`, this.id)
}