import { OasysPage, Element } from 'classes'

export class MaintainAuditImportanceLevels extends OasysPage {

    name = 'MaintainAuditImportanceLevels'
    title = 'Maintain Audit Importance Levels'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Maintain Audit Importance Levels' }

    close = new Element.Button(this.page, 'Close')
    save = new Element.Button(this.page, 'Save')
    auditableEventType = new Element.Textbox(this.page, '#P10_EVENT_TYPE_DESC')
    importanceLevel = new Element.Select(this.page, '#P10_EVENT_LEVEL')
    auditableEventTypeColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Auditable Event Type')
    importanceLevelColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Importance Level')
}
