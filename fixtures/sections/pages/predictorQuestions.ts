import { BaseAssessmentPage, Element } from 'classes'

export class PredictorQuestions extends BaseAssessmentPage {

    name = 'PredictorQuestions'
    title = 'Predictor Questions '
    menu: Menu = { type: 'Floating', level1: 'Predictor Questions' }

    pageHeader = new Element.Text(this.page, '#P5_TITLE_LABEL')
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
    aCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_1_1')
    aCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_1_2_YES')
    aPrevious = new Element.Checkbox(this.page, '#itm_8_2_1_3_YES')
    aPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_1_4_YES')
    /** B Methadone (not prescribed) */
    bCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_2_1')
    bCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_2_2_YES')
    bPrevious = new Element.Checkbox(this.page, '#itm_8_2_2_3_YES')
    bPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_2_4_YES')
    /** C Other opiates */
    cCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_3_1')
    cCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_3_2_YES')
    cPrevious = new Element.Checkbox(this.page, '#itm_8_2_3_3_YES')
    cPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_3_4_YES')
    /** D Crack/Cocaine */
    dCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_4_1')
    dCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_4_2_YES')
    dPrevious = new Element.Checkbox(this.page, '#itm_8_2_4_3_YES')
    dPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_4_4_YES')
    /** E Cocaine Hydrochloride */
    eCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_5_1')
    eCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_5_2_YES')
    ePrevious = new Element.Checkbox(this.page, '#itm_8_2_5_3_YES')
    ePreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_5_4_YES')
    /** F Misused prescribed drugs */
    fCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_6_1')
    fCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_6_2_YES')
    fPrevious = new Element.Checkbox(this.page, '#itm_8_2_6_3_YES')
    fPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_6_4_YES')
    /** G Benzodiazepines */
    gCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_7_1')
    gCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_7_2_YES')
    gPrevious = new Element.Checkbox(this.page, '#itm_8_2_7_3_YES')
    gPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_7_4_YES')
    /** H Amphetamines */
    hCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_8_1')
    hCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_8_2_YES')
    hPrevious = new Element.Checkbox(this.page, '#itm_8_2_8_3_YES')
    hPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_8_4_YES')
    /** I Hallucinogens */
    iCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_9_1')
    iPrevious = new Element.Checkbox(this.page, '#itm_8_2_9_3_YES')
    /** J Ecstasy */
    jCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_10_1')
    jPrevious = new Element.Checkbox(this.page, '#itm_8_2_10_3_YES')
    /** K Cannabis */
    kCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_11_1')
    kPrevious = new Element.Checkbox(this.page, '#itm_8_2_11_3_YES')
    /** L Solvents */
    lCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_12_1')
    lPrevious = new Element.Checkbox(this.page, '#itm_8_2_12_3_YES')
    /** M Steroids */
    mCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_13_1')
    mCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_13_2_YES')
    mPrevious = new Element.Checkbox(this.page, '#itm_8_2_13_3_YES')
    mPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_13_4_YES')
    /** P Spice */
    pCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_15_1')
    pPrevious = new Element.Checkbox(this.page, '#itm_8_2_15_3_YES')
    /** Q Ketamine */
    qCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_16_1')
    qCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_16_2_YES')
    qPrevious = new Element.Checkbox(this.page, '#itm_8_2_16_3_YES')
    qPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_16_4_YES')
    /** N Other */
    nCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_14_1')
    nCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_14_2_YES')
    nPrevious = new Element.Checkbox(this.page, '#itm_8_2_14_3_YES')
    nPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_14_4_YES')
    other = new Element.Textbox(this.page, '#textarea_8_2_14_t')
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

}

