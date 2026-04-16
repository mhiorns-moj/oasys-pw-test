import { OasysPage, Element } from 'classes'

export class SigningRoles extends OasysPage {

    name = 'SigningRoles'
    title = 'Maintain Signing Roles'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Signing Roles' }

    close = new Element.Button(this.page, 'Close')
    enterNewRole = new Element.Button(this.page, 'Enter New Role')
    roleNameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Role Name')
    tierLevelColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Tier Level')
    riskLevelColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Risk Level')
    exemptionLevelColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Exemption Level')
    psrRiskLevelColumn = new Element.Column(this.page, Element.ColumnType.Column, 'PSR Risk Level')
    psrTierLevelColumn = new Element.Column(this.page, Element.ColumnType.Column, 'PSR Tier Level')
    transferRequestLevelColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Transfer Request Level')
}
