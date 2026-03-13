import { OasysPage, Element } from 'classes'

export class OffenderHistoryTab extends OasysPage {

    name = 'OffenderHistoryTab'

    startDateColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Start Date')
    prisonEstablishmentColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Prison Establishment')
    offenderSupervisorColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Offender Supervisor')
    probationProviderColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Probation Provider')
    probationTeamColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Probation Team')
    offenderManagerColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Offender Manager')
    controllingOwnerColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Controlling Owner')
    physicalLocationColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Physical Location')
    dateColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Date of Merge')
    previousProbationOwnerColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Previous Owning Probation Provider')
    previousPrisonOwnerColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Previous Owning Prison Establishment')
    eventNameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Auditable Events Event Name')
    eventColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Auditable Events Date / Time')
    eventUsernameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Auditable Events Username')
    eventLaoStatusColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Auditable Events LAO Status')
    eventDetailsColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Auditable Events Details')
    eventIpAddressColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Auditable Events User IP Address')
}
