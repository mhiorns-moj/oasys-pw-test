import { OasysPage, Element } from 'classes'
import { SentencePlan } from './sentencePlan'

export class RspSection72to10 extends SentencePlan {

    name = 'RSPSection72to10'
    title = 'Review Sentence Plan'
    menu: Menu = { type: 'Floating', level1: 'Review Sentence Plan', level2: 'Section 8 to 10' }

    supervisionArrangements = new Element.Textbox(this.page, '#textarea_RP_113')
    agreeWithPlan = new Element.Select(this.page, '#itm_RP_49')
    whyNotAgree = new Element.Textbox(this.page, '#textarea_RP_49_t')
    offenderComments = new Element.Textbox(this.page, '#textarea_RP_51')
    offenderName = new Element.Textbox(this.page, '#itm_RP_52')
    offenderSigned = new Element.Select(this.page, '#itm_RP_53')
    dateSigned = new Element.Textbox<OasysDate>('#itm_RP_54')
    whyNotSign = new Element.Textbox(this.page, '#textarea_RP_55')
    assessorComments = new Element.Textbox(this.page, '#textarea_RP_56')
    assessorName = new Element.Textbox(this.page, '#itm_RP_57')
    position = new Element.Textbox(this.page, '#itm_RP_58')
    assessmentDate = new Element.Textbox<OasysDate>('#itm_RP_59')
    enterContributorDetails = new Element.Button(this.page, 'Enter Contributor Details')
    nameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Name')
    roleColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Role / department / partnership agency')
    attendColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Did they attend the sentence planning board')
    deleteColumn = new Element.Column(this.page, Element.ColumnType.ButtonColumn, 'Delete')
    publicProtectionConference = new Element.Select(this.page, '#itm_RP_68')
    conferenceDate = new Element.Textbox<OasysDate>('#itm_RP_69')
    conferenceChair = new Element.Textbox(this.page, '#itm_RP_70')
    countersignerComments = new Element.Textbox(this.page, '#textarea_RP_96')
    countersignerSupervisor = new Element.Textbox(this.page, '#itm_RP_97')
    dateAgreed = new Element.Textbox<OasysDate>('#itm_RP_98')
}
