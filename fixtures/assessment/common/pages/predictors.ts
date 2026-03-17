import { BaseAssessmentPage, Element } from 'classes'
import * as lib from 'lib'

export class Predictors extends BaseAssessmentPage {

    name = 'Predictors'
    title = '1 - Predictors'
    menu: Menu = { type: 'Floating', level1: 'Section 1', level2: 'Predictors' }

    scoresChanged = new Element.Text(this.page, "p:contains('The following scores have now changed i.e.   OGRS3-1YEAR OGRS3 - 2YEAR')")
    dateFirstSanction = new Element.Textbox<OasysDate>(this.page, '#itm_1_8_2', true)
    ageFirstSanction = new Element.Textbox<string>(this.page, '#itm_1_8')
    /** Total number of sanctions */
    o1_32 = new Element.Textbox<number>(this.page, '#itm_1_32')
    /** Number of sanctions involving violent offences */
    o1_40 = new Element.Textbox<number>(this.page, '#itm_1_40')
    /** Date of current conviction */
    o1_29 = new Element.Textbox<OasysDate>(this.page, '#itm_1_29', true)
    /** Ever committed sexually motivated offence */
    o1_30 = new Element.Select<YesNoAnswer>(this.page, '#itm_1_30')
    o1_30RO = new Element.Textbox<string>(this.page, '#itm_1_30')
    /** Current offence has sexual motivation */
    o1_41 = new Element.Select<YesNoAnswer>(this.page, '#itm_1_41')
    /** Contact with stranger */
    o1_44 = new Element.Select<YesNoAnswer>(this.page, '#itm_1_44')
    /** Date of most recent sexual sanction */
    o1_33 = new Element.Textbox<OasysDate>(this.page, '#itm_1_33', true)
    /** Number of adult sexual offences */
    o1_34 = new Element.Textbox<number>(this.page, '#itm_1_34')
    /** Number of child sexual offences */
    o1_45 = new Element.Textbox<number>(this.page, '#itm_1_45')
    /** Number of indecent image offences */
    o1_46 = new Element.Textbox<number>(this.page, '#itm_1_46')
    /** Number of non-contact sexual offences */
    o1_37 = new Element.Textbox<number>(this.page, '#itm_1_37')
    /** Earliest release date */
    o1_38 = new Element.Textbox<OasysDate>(this.page, '#itm_1_38', true)
    /** Date of offence since 1.38 date
     *  Note: might not work if you try to go to it straight after 1.38 as field isn't necessarily visible yet */
    o1_43 = new Element.Textbox<OasysDate>(this.page, '#itm_1_43', true)

    /** All reoffending predictor */
    arp = new Element.Text(this.page, "td:contains('ALL REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+td")
    /** Violent reoffending predictor */
    vrp = new Element.Text(this.page, "td:contains('VIOLENT REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+td:first")
    /** Servious violent reoffending predictor */
    svrp = new Element.Text(this.page, "td:contains('SERIOUS VIOLENT REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+td")
    ospDc = new Element.Textbox<string>(this.page, '#textarea_D6')
    ospIic = new Element.Textbox<string>(this.page, '#textarea_D5')
    rsrScore = new Element.Textbox<string>(this.page, '#textarea_D3')
    rsrErrors = new Element.Textbox<string>(this.page, '#textarea_D4')


    async populateMinimal() {

        lib.log('Minimally populating predictors page')
        await this.goto(true)
        await this.dateFirstSanction.setValue({ years: -2 })
        await this.o1_32.setValue(2)
        await this.o1_40.setValue(0)
    }
}

