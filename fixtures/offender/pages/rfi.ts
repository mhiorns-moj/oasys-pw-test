import { OasysPage, Element } from 'classes'

export class Rfi extends OasysPage {

    name = 'Rfi'
    title = 'RFI Form'
    menu: Menu = { type: 'Subform', level1: 'RFI' }

    save = new Element.Button(this.page, 'Save')
    send = new Element.Button(this.page, 'Send')
    complete = new Element.Button(this.page, 'Complete')
    close = new Element.Button(this.page, 'Close')
    typeOfRfi = new Element.Select<'Internal' | 'External' | 'Ad Hoc'>(this.page, '#P1_TYPE_RFI_TYPE_ELM')
    internalProvider = new Element.Select(this.page, '#P1_INT_REQ_CT_AREA_EST_CODE')
    users = new Element.Shuttle(this.page, '#shuttleRFI030_INTERNAL')
    recipient = new Element.Select(this.page, '#P1_EXT_REQ_RECIPIENT')
    adHocProvider = new Element.Select(this.page, '#P1_ADHOC_CT_AREA_EST_CODE')
    internalUser = new Element.Lov(this.page, '#P1_ADHOC_INFO_INTERNAL_LABEL')
    externalUser = new Element.Select(this.page, '#P1_ADHOC_INFO_EXTERNAL')
    offenderName = new Element.Textbox(this.page, '#P1_OFF_NAME')
    pnc = new Element.Textbox(this.page, '#P1_OFF_PNC')
    probationCrn = new Element.Textbox(this.page, '#P1_OFF_CMS_PROB_NUMBER')
    offenderProvider = new Element.Textbox(this.page, '#P1_OFF_PRIMARY_LOCATION_AREA_DESC')
    dateRequested = new Element.Textbox<OasysDate>(this.page, '#P1_RFI_DATE_REQUEST_MADE')
    requestedBy = new Element.Textbox(this.page, '#P1_RFI_OASYS_USER_CODE_DESC')
    phoneNumber = new Element.Textbox(this.page, '#P1_RFI_PHONE_NUMBER')
    emailAddress = new Element.Textbox(this.page, '#P1_RFI_EMAIL_ADDRESS')
    returnBy = new Element.Textbox(this.page, '#P1_RFI_DATE_RFI_DUE')
    dateReturned = new Element.Textbox<OasysDate>(this.page, '#P1_RFI_DATE_RFI_RETURNED')
    dateProvided = new Element.Textbox<OasysDate>(this.page, '#P1_RFI_DATE_PROVIDED')
    providedBy = new Element.Textbox(this.page, '#P1_RFI_PROVIDED_BY')
    reasonForRequest = new Element.Select(this.page, '#P1_RFI_PURPOSE_ASSESSMENT_ELM')
    specifically = new Element.Textbox(this.page, '#P1_RFI_SPECIFIC_INFO_REQUEST')
    specificallyResponse = new Element.Textbox(this.page, '#P1_RFI_SPECIFIC_INFO_RESPONSE')
    offendingRelatedNeeds = new Element.Textbox(this.page, '#P1_RFI_OFFENDING_NEEDS_RESPONSE')
    riskOfSeriousHarm = new Element.Textbox(this.page, '#P1_RFI_RISK_OF_HARM_RESPONSE')
    progressAgainstSentencePlan = new Element.Textbox(this.page, '#P1_RFI_PLAN_PROGRESS_RESPONSE')
    anyOtherInformation = new Element.Textbox(this.page, '#P1_RFI_OTHER_INFO_RESPONSE')
}
