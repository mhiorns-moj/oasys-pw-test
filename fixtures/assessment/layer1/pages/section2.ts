import { BaseAssessmentPage, Element } from 'classes'
import * as lib from 'lib'

export class Section2 extends BaseAssessmentPage {

    name = 'Layer1Section2'
    title = '2 - Analysis of Offences'
    menu: Menu = { type: 'Floating', level1: '2 - Offence Analysis' }

    briefOffenceDetails = new Element.Textbox(this.page, '#textarea_2_1')
    o2_2Weapon = new Element.Select<YesNoAnswer>(this.page, '#itm_2_2_V2_WEAPON')
    o2_2SpecifyWeapon = new Element.Textbox(this.page, '#itm_2_2_t_V2')
    o2_2Violence = new Element.Select<YesNoAnswer>(this.page, '#itm_2_2_V2_ANYVIOL')
    o2_2ExcessiveViolence = new Element.Select<YesNoAnswer>(this.page, '#itm_2_2_V2_EXCESSIVE')
    o2_2Arson = new Element.Select<YesNoAnswer>(this.page, '#itm_2_2_V2_ARSON')
    o2_2PhysicalDamage = new Element.Select<YesNoAnswer>(this.page, '#itm_2_2_V2_PHYSICALDAM')
    o2_2Sexual = new Element.Select<YesNoAnswer>(this.page, '#itm_2_2_V2_SEXUAL')
    o2_2DomesticAbuse = new Element.Select<YesNoAnswer>(this.page, '#itm_2_2_V2_DOM_ABUSE')
    o2_3Direct = new Element.Checkbox(this.page, '#itm_2_3_DIRECTCONT')
    o2_3Hate = new Element.Checkbox(this.page, '#itm_2_3_HATE')
    o2_3ResponseToVictim = new Element.Checkbox(this.page, '#itm_2_3_RESPTOVICTIM')
    o2_3PhysicalViolence = new Element.Checkbox(this.page, '#itm_2_3_PHYSICALVIOL')
    o2_3RepeatVictimisation = new Element.Checkbox(this.page, '#itm_2_3_REPEATVICT')
    o2_3Strangers = new Element.Checkbox(this.page, '#itm_2_3_STRANGERS')
    o2_3Stalking = new Element.Checkbox(this.page, '#itm_2_3_STALKING')
    enterVictimDetails = new Element.Button(this.page, 'Enter Victim Details')
    victimAgeColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Approx. age')
    victimGenderColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Gender')
    victimRaceColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Race/Ethnicity')
    victimRelationshipColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Victim - perpetrator relationship')
    victimDeleteColumn = new Element.Column(this.page, Element.ColumnType.ButtonColumn, 'Delete')
    o2_4Relationship = new Element.Textbox(this.page, '#textarea_2_4_2')
    o2_4OtherInformation = new Element.Textbox(this.page, '#textarea_2_4_1')
    impactOnVictim = new Element.Textbox(this.page, '#textarea_2_5')
    impactRecognised = new Element.Select<YesNoAnswer>(this.page, '#itm_2_6')


    async populateMinimal() {

        lib.log('Minimally populating layer 1 section 2')
        await this.goto(true)
        await this.o2_2Weapon.setValue('No')
        await this.o2_2Violence.setValue('No')
        await this.o2_2ExcessiveViolence.setValue('No')
        await this.o2_2Arson.setValue('No')
        await this.impactRecognised.setValue('Yes')
    }
}


