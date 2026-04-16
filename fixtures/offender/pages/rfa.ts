import { OasysPage, Element } from 'classes'

export class Rfa extends OasysPage {

    name = 'Rfa'
    title = 'Request for Access'

    submit = new Element.Button(this.page, 'Submit')
    cancel = new Element.Button(this.page, 'Cancel')
    surname = new Element.Textbox(this.page, '#P60_FAMILY_NAME')
    pnc = new Element.Textbox(this.page, '#P60_PNC')
    statusIcons = new Element.IconContainer(this.page, '#P60_ICONS')
    forename = new Element.Textbox(this.page, '#P60_FORENAME_1')
    mergePnc = new Element.Textbox(this.page, '#P60_MERGE_PNC_NUMBER')
    otherForenames = new Element.Textbox(this.page, '#P60_OTHER_FORENAMES')
    cro = new Element.Textbox(this.page, '#P60_CRO_NUMBER')
    owningAreaEst = new Element.Textbox(this.page, '#P60_PRIMARY_LOC_AREA_DESC')
    probationCrn = new Element.Textbox(this.page, '#P60_CMS_PROB_NUMBER')
    location = new Element.Textbox(this.page, '#P60_PHYSICAL_LOCATION')
    dateOfBirth = new Element.Textbox<OasysDate>(this.page, '#P60_DATE_OF_BIRTH', true)
    prisonNomisNo = new Element.Textbox(this.page, '#P60_CMS_PRIS_NUMBER')
    deceasedInd = new Element.Textbox(this.page, '#P60_DECEASED_IND')
    gender = new Element.Textbox(this.page, '#P60_GENDER_ELM')
    prisonLidsNo = new Element.Textbox(this.page, '#P60_PRISON_NUMBER')
    ethnicCategory = new Element.Textbox(this.page, '#P60_ETHNIC_CAT_ELM_DESC')
    rfaReason = new Element.Select(this.page, '#P60_RFA_REASON')
    otherReason = new Element.Textbox(this.page, '#P60_RFA_REASON_OTHER')
    requestorComments = new Element.Textbox(this.page, '#P60_REQUESTER_COMMENTS')
    rfaLength = new Element.Textbox(this.page, '#P60_RFA_EXPIRY')
    trustyText = new Element.Text(this.page, '#P60_STATIC_TEXT_TRUSTY')
    nonTrustyText = new Element.Textbox(this.page, '#P60_STATIC_TEXT')
    userTeam = new Element.Select(this.page, '#P60_USER_TEAM')
    users = new Element.Shuttle(this.page, '#shuttleOFF030_USERS')
}
