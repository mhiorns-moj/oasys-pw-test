import { OasysPage, Element } from 'classes'

export class EditSigningRole extends OasysPage {

    name = 'EditSigningRole'
    title = 'Edit Signing Role'

    deleteRole = new Element.Button(this.page, 'Delete Role')
    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    signingRoleName = new Element.Textbox(this.page, '#P10_REF_ROLE_DESC')
    signingTierLevel = new Element.Select(this.page, '#P10_SIGNING_TIER_LEVEL')
    signingRiskLevel = new Element.Select(this.page, '#P10_SIGNING_RISK_LEVEL')
    signingExemptionLevel = new Element.Select(this.page, '#P10_SIGNING_EXEMPTION_LEVEL')
    psrSigningRiskLevel = new Element.Select(this.page, '#P10_SIGNING_PSR_RISK_LEVEL')
    psrSigningTierLevel = new Element.Select(this.page, '#P10_SIGNING_PSR_TIER_LEVEL')
    signingTransferRequestLevel = new Element.Select(this.page, '#P10_SIGNING_TRANSFER_REQUEST_LEVEL')
}
