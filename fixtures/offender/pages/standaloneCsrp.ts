import { OasysPage, Element } from 'classes'

export class StandaloneCsrp extends OasysPage {

    name = 'StandaloneCsrp'
    title = ''
    menu: Menu = { type: 'Subform', level1: 'CSRP' }

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    calculateScores = new Element.Button(this.page, 'Calculate Predictor Scores')

    heading = new Element.Text(this.page, '#P5_HEADING_LABEL')
    offence = new Element.Textbox<string>(this.page, '#P5_CT_OFFENCE_CODE_TEXT')
    offenceDescription = new Element.Textbox<string>(this.page, '#LOVDSC_P5_CT_OFFENCE_CODE_TEXT')
    subcode = new Element.Textbox<string>(this.page, '#P5_CT_OFFENCE_SUBCODE_TEXT')
    subcodeDescription = new Element.Textbox<string>(this.page, '#LOVDSC_P5_CT_OFFENCE_SUBCODE_TEXT')
    offenceLov = new Element.Link(this.page, "//input[@id='P5_CT_OFFENCE_CODE_TEXT']/following::a/img")
    subcodeLov = new Element.Link(this.page, "//input[@id='P5_CT_OFFENCE_SUBCODE_TEXT']/following::a/img")
    /**
     *  Date of first sanction
     */
    o1_8 = new Element.Textbox<OasysDate>(this.page, '#P5_QU_1_8_2', true)
    /**
     *  Age at first conviction (calculated from 1.8)
     */
    o1_8Age = new Element.Textbox<string>(this.page, '#P5_QU_1_8')
    /**
     *  Number of sanctions for all offences
     */
    o1_32 = new Element.Textbox<number>(this.page, '#P5_QU_1_32')
    /**
     *  How many of the sanctions involved violent offences?
     */
    o1_40 = new Element.Textbox<number>(this.page, '#P5_QU_1_40')
    /**
     *  Date of current conviction
     */
    o1_29 = new Element.Textbox<OasysDate>(this.page, '#P5_QU_1_29', true)
    /**
     *  Ever committed a sexual offence
     */
    o1_30 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_1_30')
    /**
     *  Does of the current offence have sexual motivation
     */
    o1_41 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_1_41')
    /**
     *  Does the current offence involve a victim who was a stranger?
     */
    o1_42 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_1_42')
    /**
     *  Date of most recent sexual offence
     */
    o1_33 = new Element.Textbox<OasysDate>(this.page, '#P5_QU_1_33', true)
    /**
     *  Number of adult sexual offences
     */
    o1_34 = new Element.Textbox<number>(this.page, '#P5_QU_1_34')
    /**
     *  Number of previous/current sanctions involving direct contact child sexual/sexually motivated offences
     */
    o1_35 = new Element.Textbox<number>(this.page, '#P5_QU_1_35')
    /**
     *  Number of previous/current sanctions involving indecent child image sexual/sexually motivated offences or indirect child contacts
     */
    o1_36 = new Element.Textbox<number>(this.page, '#P5_QU_1_36')
    /**
     *  Number of non-contact sexual offences
     */
    o1_37 = new Element.Textbox<number>(this.page, '#P5_QU_1_37')
    /**
     *  Date of commencement of community sentence
     */
    o1_38 = new Element.Textbox<OasysDate>(this.page, '#P5_QU_1_38', true)
    /**
     *  Have you completed an Offender interview?
     */
    o1_39 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_1_39')
    /**
     * Did the offence involve carrying or using a weapon
    */
    o2_2 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_2_2')
    /**
     * Specify which weapon
    */
    o2_2Weapon = new Element.Textbox(this.page, '#P5_QU_2_2_TXT')
    /**
     *  Is the offender living in suitable accommodation?
     */
    o3_4 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_3_4')
    /**
     *  Is the person unemployed?
     */
    o4_2 = new Element.Select<'0-No' | '0-Not available for work' | '2-Yes' | 'Missing'>(this.page, '#P5_QU_4_2')
    /**
     *  What is the person's current relationship with partner?
     */
    o6_4 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_6_4')
    /**
     *  Is there evidence of current or previous domestic abuse?
     */
    o6_7 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7DA')
    o6_7VictimPartner = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7_1_1DA')
    o6_7VictimFamily = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7_1_2DA')
    o6_7PerpetratorPartner = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7_2_1DA')
    o6_7PerpetratorFamily = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7_2_2DA')
    o6_8 = new Element.Select<Q6_8Answer>(this.page, '#P5_QU_6_8')
    o7_2 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_7_2')
    o8_1 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_8_1')
    /** A Heroin */
    aCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_HEROIN_CURR_USE')
    aCurrentlyInjected = new Element.Checkbox(this.page, '#itm_HEROIN_CURR_INJ')
    aPrevious = new Element.Checkbox(this.page, '#itm_HEROIN_PREV_USE')
    aPreviouslyInjected = new Element.Checkbox(this.page, '#itm_HEROIN_PREV_INJ')
    /** B Methadone (not prescribed) */
    bCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_METHADONE_CURR_USE')
    bCurrentlyInjected = new Element.Checkbox(this.page, '#itm_METHADONE_CURR_INJ')
    bPrevious = new Element.Checkbox(this.page, '#itm_METHADONE_PREV_USE')
    bPreviouslyInjected = new Element.Checkbox(this.page, '#itm_METHADONE_PREV_INJ')
    /** C Other opiates */
    cCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_OTHER_OPIATE_CURR_USE')
    cCurrentlyInjected = new Element.Checkbox(this.page, '#itm_OTHER_OPIATE_CURR_INJ')
    cPrevious = new Element.Checkbox(this.page, '#itm_OTHER_OPIATE_PREV_USE')
    cPreviouslyInjected = new Element.Checkbox(this.page, '#itm_OTHER_OPIATE_PREV_INJ')
    /** D Crack/Cocaine */
    dCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_CRACK_COCAINE_CURR_USE')
    dCurrentlyInjected = new Element.Checkbox(this.page, '#itm_CRACK_COCAINE_CURR_INJ')
    dPrevious = new Element.Checkbox(this.page, '#itm_CRACK_COCAINE_PREV_USE')
    dPreviouslyInjected = new Element.Checkbox(this.page, '#itm_CRACK_COCAINE_PREV_INJ')
    /** E Cocaine Hydrochloride */
    eCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_COCAINE_HYDROCHLORIDE_CURR_USE')
    eCurrentlyInjected = new Element.Checkbox(this.page, '#itm_COCAINE_HYDROCHLORIDE_CURR_INJ')
    ePrevious = new Element.Checkbox(this.page, '#itm_COCAINE_HYDROCHLORIDE_PREV_USE')
    ePreviouslyInjected = new Element.Checkbox(this.page, '#itm_COCAINE_HYDROCHLORIDE_PREV_INJ')
    /** F Misused prescribed drugs */
    fCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_MISUSED_PRESCRIBED_CURR_USE')
    fCurrentlyInjected = new Element.Checkbox(this.page, '#itm_MISUSED_PRESCRIBED_CURR_INJ')
    fPrevious = new Element.Checkbox(this.page, '#itm_MISUSED_PRESCRIBED_PREV_USE')
    fPreviouslyInjected = new Element.Checkbox(this.page, '#itm_MISUSED_PRESCRIBED_PREV_INJ')
    /** G Benzodiazepines */
    gCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_BENZODIAZEPINES_CURR_USE')
    gCurrentlyInjected = new Element.Checkbox(this.page, '#itm_BENZODIAZEPINES_CURR_INJ')
    gPrevious = new Element.Checkbox(this.page, '#itm_BENZODIAZEPINES_PREV_USE')
    gPreviouslyInjected = new Element.Checkbox(this.page, '#itm_BENZODIAZEPINES_PREV_INJ')
    /** H Amphetamines */
    hCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_AMPHETAMINES_CURR_USE')
    hCurrentlyInjected = new Element.Checkbox(this.page, '#itm_AMPHETAMINES_CURR_INJ')
    hPrevious = new Element.Checkbox(this.page, '#itm_AMPHETAMINES_PREV_USE')
    hPreviouslyInjected = new Element.Checkbox(this.page, '#itm_AMPHETAMINES_PREV_INJ')
    /** I Hallucinogens */
    iCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_HALLUCINOGENS_CURR_USE')
    iPrevious = new Element.Checkbox(this.page, '#itm_HALLUCINOGENS_PREV_USE')
    /** J Ecstasy */
    jCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_ECSTASY_CURR_USE')
    jPrevious = new Element.Checkbox(this.page, '#itm_ECSTASY_PREV_USE')
    /** K Cannabis */
    kCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_CANNABIS_CURR_USE')
    kPrevious = new Element.Checkbox(this.page, '#itm_CANNABIS_PREV_USE')
    /** L Solvents */
    lCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_SOLVENTS_CURR_USE')
    lPrevious = new Element.Checkbox(this.page, '#itm_SOLVENTS_PREV_USE')
    /** M Steroids */
    mCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_STERIODS_CURR_USE')
    mCurrentlyInjected = new Element.Checkbox(this.page, '#itm_STERIODS_CURR_INJ')
    mPrevious = new Element.Checkbox(this.page, '#itm_STERIODS_PREV_USE')
    mPreviouslyInjected = new Element.Checkbox(this.page, '#itm_STERIODS_PREV_INJ')
    /** P Spice */
    pCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_SPICE_CURR_USE')
    pPrevious = new Element.Checkbox(this.page, '#itm_SPICE_PREV_USE')
    /** Q Ketamine */
    qCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_KETAMINE_CURR_USE')
    qCurrentlyInjected = new Element.Checkbox(this.page, '#itm_KETAMINE_CURR_INJ')
    qPrevious = new Element.Checkbox(this.page, '#itm_KETAMINE_PREV_USE')
    qPreviouslyInjected = new Element.Checkbox(this.page, '#itm_KETAMINE_PREV_INJ')
    /** N Other */
    nCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_OTHER_CURR_USE')
    nCurrentlyInjected = new Element.Checkbox(this.page, '#itm_OTHER_CURR_INJ')
    nPrevious = new Element.Checkbox(this.page, '#itm_OTHER_PREV_USE')
    nPreviouslyInjected = new Element.Checkbox(this.page, '#itm_OTHER_PREV_INJ')
    other = new Element.Textbox(this.page, '#textarea_OTHER_DRUG_TEXT')
    o8_8 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_8_8')
    /**
     * Is the person's current use of alcohol a problem
     */
    o9_1 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_9_1')
    /**
     * Is there evidence of binge drinking
     */
    o9_2 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_9_2')
    /**
     * Is impulsivity a problem for the offender
     */
    o11_2 = new Element.Select<ProblemsAnswer>(this.page, '#P5_QU_11_2')
    /**
     * Is temper control a problem for the offender
     */
    o11_4 = new Element.Select<ProblemsAnswer>(this.page, '#P5_QU_11_4')
    /**
     * Does the offender have pro-criminal attitudes
     */
    o12_1 = new Element.Select<ProblemsAnswer>(this.page, '#P5_QU_12_1')

    weaponPrevious = new Element.Select<YesNoAnswer>(this.page, '#P5_PREVPREV')
    murderPrevious = new Element.Select<YesNoAnswer>(this.page, '#P5_PREVPREV')
    woundingPrevious = new Element.Select<YesNoAnswer>(this.page, '#P5PREVPREV')
    burglaryPrevious = new Element.Select<YesNoAnswer>(this.page, '#P5_BUPREVPREV')
    arsonPrevious = new Element.Select<YesNoAnswer>(this.page, '#P5PREVPREV')
    damagePrevious = new Element.Select<YesNoAnswer>(this.page, '#P5_CRPREVPREV')
    kidnappingPrevious = new Element.Select<YesNoAnswer>(this.page, '#P5_PREVPREV')
    firearmPrevious = new Element.Select<YesNoAnswer>(this.page, '#P5_FPREVPREV')
    robberyPrevious = new Element.Select<YesNoAnswer>(this.page, '#P5_RPREVPREV')

    arpText = new Element.Text(this.page, "td:has-text('ALL REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+td")
    vrpText = new Element.Text(this.page, ":nth-match(td:has-text('VIOLENT REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+td,1)")
    svrpText = new Element.Text(this.page, "td:has-text('SERIOUS VIOLENT REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+td")
    dcSrpBand = new Element.Text(this.page, ":nth-match(svg:has-text('DC-SRP')>text,1)")
    dcSrpText = new Element.Text(this.page, '#P5_OSPCD_TEXTAREA')
    iicSrpBand = new Element.Text(this.page, ":nth-match(svg:has-text('IIC-SRP')>text,1)")
    iicSrpText = new Element.Text(this.page, '#P5_OSPIIC_TEXTAREA')
    csrpBand = new Element.Text(this.page, ":nth-match(svg:has-text('CSRP')>text,1)")
    csrpType = new Element.Text(this.page, ":nth-match(svg:has-text('CSRP')>text:nth-of-type(2),1)")
    csrpScore = new Element.Text(this.page, ":nth-match(svg:has-text('CSRP')>text:nth-of-type(4),1)")
    csrpText = new Element.Text(this.page, '#P5_RSR_TEXT_1')
    
    arpErrorText = new Element.Text(this.page, "tr:has-text('ALL REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+tr")
    vrpErrorText = new Element.Text(this.page, ":nth-match(tr:has-text('VIOLENT REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+tr,1)")
    svrpErrorText = new Element.Text(this.page, "tr:has-text('SERIOUS VIOLENT REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+tr")
    csrpErrorText = new Element.Text(this.page, '#P5_RSR_TEXT_2')

}
