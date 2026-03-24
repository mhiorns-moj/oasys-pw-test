import { OasysPage, Element } from 'classes'

export class PsrOutlinePlan extends OasysPage {

    name = 'PSROutlinePlan'
    title = 'Offender Objectives'
    menu: Menu = { type: 'Floating', level1: 'PSR Outline Plan' }

    signAndLock = new Element.Button(this.page, 'Sign & Lock')
    countersign = new Element.Button(this.page, 'Countersign')
    current = new Element.Link(this.page, 'Current')
    objectiveDescriptionColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Objective Description')
    statusColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Status')
    upColumn = new Element.Column(this.page, Element.ColumnType.ImageColumn, 'Up')
    downColumn = new Element.Column(this.page, Element.ColumnType.ImageColumn, 'Down')
    pullFromPreviousPlan = new Element.Button(this.page, 'Pull From Previous Plan')
    addObjective = new Element.Button(this.page, 'Add Objective')
    criminogenicNeedsSummary = new Element.Link(this.page, 'Criminogenic Needs SummaryÂ(Active)')
    ogrs3 = new Element.Link(this.page, 'OGRS3 / OGP / OVP')
}
