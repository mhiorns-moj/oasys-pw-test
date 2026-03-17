import { OasysPage, Element } from 'classes'

export class MaintainProvider extends OasysPage {

    name = 'MaintainProvider'
    title = 'Provider/Establishment Profile'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Provider / Establishment Profile' }

    create = new Element.Button(this.page, 'Create')
    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    serviceIndicator = new Element.Select(this.page, '#P10_SERVICE')
    type = new Element.Select(this.page, '#P10_AREA_EST_TYPE_ELM')
    providerName = new Element.Textbox(this.page, '#P10_AREA_EST_NAME')
    postTrIndicator = new Element.Radiogroup('#P10_POST_TR_IND')
    code = new Element.Textbox(this.page, '#P10_AREA_EST_CODE')
    trainerPrison = new Element.Radiogroup('#P10_TRAIN_PRIS')
    contactName = new Element.Lov('#P10_CONTACT_NAME_LABEL')
    contactNumber = new Element.Textbox(this.page, '#P10_CONTACT_NUMBER')
    emailAddress = new Element.Textbox(this.page, '#P10_EMAIL_ADDRESS')
    laoContactDetails = new Element.Textbox(this.page, '#P10_LAO_CONTACT_TELEPHONE_NUMBER')
    linkToCms = new Element.Select(this.page, '#P10_LINK_TO_CMS')
    defaultTeam = new Element.Select(this.page, '#P10_DEFAULT_TEAM')
    showSdrObjectivesTable = new Element.Radiogroup('#P10_SHOW_SDR_OBJECTIVES_TABLE')
    showSdrHints = new Element.Radiogroup('#P10_SDR_HINTS')
    showCriminogenicNeedsGraph = new Element.Radiogroup('#P10_SHOW_CRIMINOGENIC_NEEDS_GRAPH')
    sdrEvidenceText = new Element.Select(this.page, '#P10_SDR_EVIDENCE_TEXT')
    psrLogoFilename = new Element.Textbox(this.page, '#P10_PSR_LOGO_FILENAME')
    runQaSample = new Element.Radiogroup('#P10_RUN_QA_SAMPLE')
    createBcsOnReception = new Element.Radiogroup('#P10_BCS_ON_RECEPTION_IND')
    localCourts = new Element.Shuttle('#shuttlePRO020_COURTS')
    actions = new Element.Shuttle('#shuttlePRO020_ACTIONS')
    trustedProviders = new Element.Shuttle('#shuttlePRO020_AREA_EST')
    stateIfNoConcerns = new Element.Radiogroup('#P10_STATE_IF_NO_CONCERNS')
    currentConcernsAboutSuicide = new Element.Radiogroup('#P10_CONCERNS_ABOUT_SUICIDE')
    currentConcernsAboutSelfHarm = new Element.Radiogroup('#P10_CONCERNS_ABOUT_SELF_HARM')
    currentConcernsAboutCopingCustody = new Element.Radiogroup('#P10_CONCERNS_ABOUT_COPING_IN_CUSTODY')
    currentConcernsAboutCopingHostel = new Element.Radiogroup('#P10_CONCERNS_ABOUT_COPING_IN_A_HOSTEL_SETTING')
    currentConcernsAboutVulnerability = new Element.Radiogroup('#P10_CONCERNS_ABOUT_VULNERABILITY')
}
