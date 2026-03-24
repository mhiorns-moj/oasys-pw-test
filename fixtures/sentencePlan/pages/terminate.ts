import { OasysPage, Element } from 'classes'

export class Terminate extends OasysPage {

    name = 'Terminate'
    title = 'Review Sentence Plan'
    menu: Menu = { type: 'Floating', level1: 'Review Sentence Plan', level2: 'Terminate' }

    reasonForTermination = new Element.Select(this.page, '#itm_RP_100')
    summary = new Element.Textbox(this.page, '#textarea_RP_77')
    assessorName = new Element.Textbox(this.page, '#itm_RP_78')
    position = new Element.Textbox(this.page, '#itm_RP_79')
    assessorSigned = new Element.Select(this.page, '#itm_RP_80')
    assessorDateSigned = new Element.Textbox<OasysDate>(this.page, '#itm_RP_81', true)
    fax = new Element.Textbox(this.page, '#itm_RP_82')
    tel = new Element.Textbox(this.page, '#itm_RP_83')
    address = new Element.Textbox(this.page, '#textarea_RP_84')
    agreeWithComments = new Element.Select(this.page, '#itm_RP_85')
    whyNotAgree = new Element.Textbox(this.page, '#textarea_RP_85_t')
    offenderComments = new Element.Textbox(this.page, '#textarea_RP_87')
    offenderName = new Element.Textbox(this.page, '#itm_RP_88')
    offenderSigned = new Element.Select(this.page, '#itm_RP_89')
    offenderDateSigned = new Element.Textbox<OasysDate>(this.page, '#itm_RP_90', true)
    orderExpired = new Element.Select(this.page, '#itm_RP_101')
    licenceExpired = new Element.Select(this.page, '#itm_RP_102')
    orderRevoked = new Element.Select(this.page, '#itm_RP_103')
    death = new Element.Select(this.page, '#itm_RP_104')
    deportation = new Element.Select(this.page, '#itm_RP_105')
    transferredToSpecialHospital = new Element.Select(this.page, '#itm_RP_106')
    transferredOutOfJurisdiction = new Element.Select(this.page, '#itm_RP_107')
    sentenceExpired = new Element.Select(this.page, '#itm_RP_108')
    variedOnAppeal = new Element.Select(this.page, '#itm_RP_109')
    releasedOnLicence = new Element.Select(this.page, '#itm_RP_110')
    other = new Element.Select(this.page, '#itm_RP_111')
    otherReason = new Element.Textbox(this.page, '#textarea_RP_111_t')
    terminationDate = new Element.Textbox<OasysDate>(this.page, '#itm_RP_93', true)
    assessorComments = new Element.Textbox(this.page, '#textarea_RP_94')
    countersignerComments = new Element.Textbox(this.page, '#textarea_RP_95')
}
