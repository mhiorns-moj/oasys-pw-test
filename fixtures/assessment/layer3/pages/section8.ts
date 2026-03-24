import { BaseAssessmentPage, Element } from 'classes'
import * as lib from 'lib'

export class Section8 extends BaseAssessmentPage {

    name = 'Section8'
    title = '8 - Drug Misuse'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '8 - Drug Misuse' }

    o8_1 = new Element.Select(this.page, '#itm_8_1')
    aCurrent = new Element.Select(this.page, '#itm_8_2_1_1')
    aCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_1_2_YES')
    aPrevious = new Element.Checkbox(this.page, '#itm_8_2_1_3_YES')
    aPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_1_4_YES')
    bCurrent = new Element.Select(this.page, '#itm_8_2_2_1')
    bCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_2_2_YES')
    bPrevious = new Element.Checkbox(this.page, '#itm_8_2_2_3_YES')
    bPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_2_4_YES')
    cCurrent = new Element.Select(this.page, '#itm_8_2_3_1')
    cCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_3_2_YES')
    cPrevious = new Element.Checkbox(this.page, '#itm_8_2_3_3_YES')
    cPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_3_4_YES')
    dCurrent = new Element.Select(this.page, '#itm_8_2_4_1')
    dCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_4_2_YES')
    dPrevious = new Element.Checkbox(this.page, '#itm_8_2_4_3_YES')
    dPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_4_4_YES')
    eCurrent = new Element.Select(this.page, '#itm_8_2_5_1')
    eCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_5_2_YES')
    ePrevious = new Element.Checkbox(this.page, '#itm_8_2_5_3_YES')
    ePreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_5_4_YES')
    fCurrent = new Element.Select(this.page, '#itm_8_2_6_1')
    fCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_6_2_YES')
    fPrevious = new Element.Checkbox(this.page, '#itm_8_2_6_3_YES')
    fPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_6_4_YES')
    gCurrent = new Element.Select(this.page, '#itm_8_2_7_1')
    gCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_7_2_YES')
    gPrevious = new Element.Checkbox(this.page, '#itm_8_2_7_3_YES')
    gPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_7_4_YES')
    hCurrent = new Element.Select(this.page, '#itm_8_2_8_1')
    hCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_8_2_YES')
    hPrevious = new Element.Checkbox(this.page, '#itm_8_2_8_3_YES')
    hPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_8_4_YES')
    iCurrent = new Element.Select(this.page, '#itm_8_2_9_1')
    iPrevious = new Element.Checkbox(this.page, '#itm_8_2_9_3_YES')
    jCurrent = new Element.Select(this.page, '#itm_8_2_10_1')
    jPrevious = new Element.Checkbox(this.page, '#itm_8_2_10_3_YES')
    kCurrent = new Element.Select(this.page, '#itm_8_2_11_1')
    kPrevious = new Element.Checkbox(this.page, '#itm_8_2_11_3_YES')
    lCurrent = new Element.Select(this.page, '#itm_8_2_12_1')
    lPrevious = new Element.Checkbox(this.page, '#itm_8_2_12_3_YES')
    mCurrent = new Element.Select(this.page, '#itm_8_2_13_1')
    mCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_13_2_YES')
    mPrevious = new Element.Checkbox(this.page, '#itm_8_2_13_3_YES')
    mPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_13_4_YES')
    pCurrent = new Element.Select(this.page, '#itm_8_2_15_1')
    pPrevious = new Element.Checkbox(this.page, '#itm_8_2_15_3_YES')
    nCurrent = new Element.Select(this.page, '#itm_8_2_14_1')
    nCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_14_2_YES')
    nPrevious = new Element.Checkbox(this.page, '#itm_8_2_14_3_YES')
    nPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_14_4_YES')
    other = new Element.Textbox(this.page, '#textarea_8_2_14_t')
    o8_4 = new Element.Select(this.page, '#itm_8_4')
    o8_5 = new Element.Select(this.page, '#itm_8_5')
    o8_6 = new Element.Select(this.page, '#itm_8_6')
    o8_8 = new Element.Select(this.page, '#itm_8_8')
    o8_9 = new Element.Select(this.page, '#itm_8_9')
    identifyIssues = new Element.Textbox(this.page, '#textarea_8_97')
    linkedToRisk = new Element.Select(this.page, '#itm_8_98')
    linkedToBehaviour = new Element.Select(this.page, '#itm_8_99')


    async populateNoIssues(suppressLog: boolean = false) {

        if (!suppressLog) log('Populating section 8 - no issues')
        await this.goto(true)
        await this.o8_1.setValue('No')
    }
}


