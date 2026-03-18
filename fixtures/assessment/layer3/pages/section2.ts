import { BaseAssessmentPage, Element } from 'classes'
import * as lib from 'lib'

export class Section2 extends BaseAssessmentPage {

    name = 'Section2'
    title = '2 - Analysis of Offences'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '2 - Offence Analysis' }

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
    o2_7OtherOffenders = new Element.Select(this.page, '#itm_2_7')
    o2_7Number = new Element.Select(this.page, '#itm_2_7_1')
    o2_7PeerGroup = new Element.Select(this.page, '#itm_2_7_2')
    o2_7Leader = new Element.Textbox(this.page, '#textarea_2_7_3')
    o2_8 = new Element.Textbox(this.page, '#textarea_2_8')
    o2_9Sexual = new Element.Select<YesNoAnswer>(this.page, '#itm_2_9_V2_SEXUAL')
    o2_9Financial = new Element.Select<YesNoAnswer>(this.page, '#itm_2_9_V2_FINANCIAL')
    o2_9Addiction = new Element.Select<YesNoAnswer>(this.page, '#itm_2_9_V2_ADDICTION')
    o2_9Emotional = new Element.Select<YesNoAnswer>(this.page, '#itm_2_9_V2_EMOTIONAL')
    o2_9Racial = new Element.Select<YesNoAnswer>(this.page, '#itm_2_9_V2_RACIAL')
    o2_9Thrill = new Element.Select<YesNoAnswer>(this.page, '#itm_2_9_V2_THRILL')
    o2_9Other = new Element.Select<YesNoAnswer>(this.page, '#itm_2_9_V2_OTHER')
    o2_9OtherDetails = new Element.Textbox(this.page, '#textarea_2_9_t_V2')
    o2_10Alcohol = new Element.Checkbox(this.page, '#itm_2_10_ALCHO')
    o2_10Pornography = new Element.Checkbox(this.page, '#itm_2_10_PORNOG')
    o2_10Medication = new Element.Checkbox(this.page, '#itm_2_10_NONMED')
    o2_10Psychiactric = new Element.Checkbox(this.page, '#itm_2_10_PSYCH')
    o2_10Emotional = new Element.Checkbox(this.page, '#itm_2_10_EMOT')
    o2_10Drugs = new Element.Checkbox(this.page, '#itm_2_10_DRUGS')
    o2_10Trauma = new Element.Checkbox(this.page, '#itm_2_10_TRAUM')
    o2_11 = new Element.Select(this.page, '#itm_2_11')
    o2_11Details = new Element.Textbox(this.page, '#textarea_2_11_t')
    o2_12 = new Element.Textbox(this.page, '#textarea_2_12')
    o2_13 = new Element.Select(this.page, '#itm_2_13')
    o2_14 = new Element.Select(this.page, '#itm_2_14')
    identifyIssues = new Element.Textbox(this.page, '#textarea_2_98')
    linkedToRisk = new Element.Select(this.page, '#itm_2_99')


    async populateNoIssues(suppressLog: boolean = false) {

        if (!suppressLog) lib.log('Populating section 2 - no issues')
        await this.goto(true)
        await this.o2_2Weapon.setValue('No')
        await this.o2_2Violence.setValue('No')
        await this.o2_2ExcessiveViolence.setValue('No')
        await this.o2_2Arson.setValue('No')
        await this.impactRecognised.setValue('Yes')
        await this.o2_9Emotional.setValue('No')
        await this.o2_14.setValue('No')
        await this.identifyIssues.setValue('Section 2 no issues')
        await this.linkedToRisk.setValue('No')
    }
}


