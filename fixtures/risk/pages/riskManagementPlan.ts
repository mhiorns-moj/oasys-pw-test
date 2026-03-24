import { BaseAssessmentPage, Element } from 'classes'
import * as lib from 'lib'

export class RiskManagementPlan extends BaseAssessmentPage {

    name = 'RiskManagementPlan'
    title = 'Risk Management Plan'
    menu: Menu = { type: 'Floating', level1: 'Risk Management Plan' }

    signAndLock = new Element.Button(this.page, 'Sign & Lock')
    countersign = new Element.Button(this.page, 'Countersign')
    countersignOverview = new Element.Button(this.page, 'Countersign Overview')
    r11_1a = new Element.Select(this.page, '#itm_RM1')
    r11_1b = new Element.Select(this.page, '#itm_RM2')
    r11_1c = new Element.Select(this.page, '#itm_RM3')
    r11_1d = new Element.Select(this.page, '#itm_RM4')
    r11_13 = new Element.Select(this.page, '#itm_RM11_13')
    weapons = new Element.Checkbox(this.page, '#itm_RM28_0_1_1_YES')
    arson = new Element.Checkbox(this.page, '#itm_RM28_0_2_1_YES')
    accommodation = new Element.Checkbox(this.page, '#itm_RM28_0_3_1_YES')
    education = new Element.Checkbox(this.page, '#itm_RM28_0_4_1_YES')
    finances = new Element.Checkbox(this.page, '#itm_RM28_0_5_1_YES')
    relationships = new Element.Checkbox(this.page, '#itm_RM28_0_6_1_YES')
    sanRelationships = new Element.Checkbox(this.page, '#itm_RM28_0_6_1_SAN_YES')
    sanHealth = new Element.Checkbox(this.page, '#itm_RM28_0_10_1_SAN_YES')
    lifestyle = new Element.Checkbox(this.page, '#itm_RM28_0_7_1_YES')
    drugs = new Element.Checkbox(this.page, '#itm_RM28_0_8_1_YES')
    alcohol = new Element.Checkbox(this.page, '#itm_RM28_0_9_1_YES')
    emotional = new Element.Checkbox(this.page, '#itm_RM28_0_10_1_YES')
    thinking = new Element.Checkbox(this.page, '#itm_RM28_0_11_1_YES')
    sanThinking = new Element.Checkbox(this.page, '#itm_RM28_0_30_1_SAN_YES')
    attitudes = new Element.Checkbox(this.page, '#itm_RM28_0_12_1_YES')
    domesticAbuse = new Element.Checkbox(this.page, '#itm_RM28_0_13_1_YES')
    hateCrime = new Element.Checkbox(this.page, '#itm_RM28_0_14_1_YES')
    stalking = new Element.Checkbox(this.page, '#itm_RM28_0_15_1_YES')
    selfHarm = new Element.Checkbox(this.page, '#itm_RM28_0_17_1_YES')
    copingInCustody = new Element.Checkbox(this.page, '#itm_RM28_0_18_1_YES')
    vulnerability = new Element.Checkbox(this.page, '#itm_RM28_0_19_1_YES')
    escapeRisks = new Element.Checkbox(this.page, '#itm_RM28_0_20_1_YES')
    riskToChildren = new Element.Checkbox(this.page, '#itm_RM28_0_21_1_YES')
    riskToKnownAdult = new Element.Checkbox(this.page, '#itm_RM28_0_22_1_YES')
    riskToPrisoners = new Element.Checkbox(this.page, '#itm_RM28_0_23_1_YES')
    riskToStaff = new Element.Checkbox(this.page, '#itm_RM28_0_24_1_YES')
    emotionalCongruence = new Element.Checkbox(this.page, '#itm_RM28_0_25_1_YES')
    sexualPreOccupation = new Element.Checkbox(this.page, '#itm_RM28_0_26_1_YES')
    sexualInterests = new Element.Checkbox(this.page, '#itm_RM28_0_27_1_YES')
    hostileOrientation = new Element.Checkbox(this.page, '#itm_RM28_0_28_1_YES')
    victimSafetyPlanning = new Element.Checkbox(this.page, '#itm_RM28_0_29_1_YES')
    keyInformation = new Element.Textbox(this.page, '#textarea_RM28_1')
    furtherConsiderations = new Element.Textbox(this.page, '#textarea_RM28')
    supervision = new Element.Textbox(this.page, '#textarea_RM30')
    monitoring = new Element.Textbox(this.page, '#textarea_RM31')
    mitigateRisk = new Element.Textbox(this.page, '#textarea_SUM10')
    interventions = new Element.Textbox(this.page, '#textarea_RM32')
    victimSafety = new Element.Textbox(this.page, '#textarea_RM33')
    contingency = new Element.Textbox(this.page, '#textarea_RM34')
    additionalComments = new Element.Textbox(this.page, '#textarea_RM35')
    considerMappa = new Element.Text(this.page, 'You have assessed the individual as High Rosh and committing current or past domestic abuse.Consider referral to MAPPA.')


    async minimal(earlyAllocation: boolean = false) {

        lib.log('Minimally populating Risk Management Plan')
        await this.goto(true)

        await this.r11_1a.setValue('Yes')
        await this.r11_1b.setValue('Yes')
        await this.r11_1c.setValue('Yes')
        await this.r11_1d.setValue('Yes')
        if (earlyAllocation) {
            await this.r11_13.setValue('Automatic early allocation')
        }
    }

    async minimalWithTextFields(earlyAllocation: boolean = false) {

        await this.minimal(earlyAllocation)
        await this.additionalComments.setValue('Some additional comments')
        await this.furtherConsiderations.setValue('FurtherConsiderations')
        await this.supervision.setValue('Supervision')
        await this.monitoring.setValue('Monitoring')
        await this.interventions.setValue('Interventions')
        await this.victimSafety.setValue('VictimSafety')
        await this.contingency.setValue('Contingency')
    }

    // export function fullyPopulated(params?: PopulateAssessmentParams) {

    //     const page = new oasys.Pages.Rosh.RiskManagementPlan().goto(true)
    //     page.r11_1a.setValue('Yes')
    //     page.r11_1b.setValue('Yes')
    //     page.r11_1c.setValue('Yes')
    //     page.r11_1d.setValue('Yes')
    //     if (params?.provider) {
    //         page.r11_13.setValue('Automatic early allocation')
    //     }

    //     if (params?.layer != 'Layer 1V2') {
    //         rmpCheckboxes(page, params)

    //         page.additionalComments.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'Some additional comments')
    //         page.furtherConsiderations.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'FurtherConsiderations')
    //         page.supervision.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'Supervision')
    //         page.monitoring.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'Monitoring')
    //         page.interventions.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'Interventions')
    //         page.victimSafety.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'VictimSafety')
    //         page.contingency.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'Contingency')
    //     }
    // }

    // function rmpCheckboxes(page: oasys.Pages.Rosh.RiskManagementPlan, params?: PopulateAssessmentParams) {

    //     if (params?.layer != 'Layer 1V2') {
    //         page.weapons.setValue(true)
    //         page.arson.setValue(true)
    //         if (params?.layer == 'Layer 3') {
    //             page.accommodation.setValue(true)
    //             page.education.setValue(true)
    //             page.finances.setValue(true)
    //             page.relationships.setValue(true)
    //             page.lifestyle.setValue(true)
    //             page.drugs.setValue(true)
    //             page.alcohol.setValue(true)
    //             page.emotional.setValue(true)
    //             page.thinking.setValue(true)
    //             page.attitudes.setValue(true)
    //         }
    //         page.domesticAbuse.setValue(true)
    //         page.hateCrime.setValue(true)
    //         page.stalking.setValue(true)
    //         page.selfHarm.setValue(true)
    //         page.copingInCustody.setValue(true)
    //         page.vulnerability.setValue(true)
    //         page.escapeRisks.setValue(true)
    //         page.riskToChildren.setValue(true)
    //         page.riskToKnownAdult.setValue(true)
    //         page.riskToPrisoners.setValue(true)
    //         page.riskToStaff.setValue(true)
    //         if (params?.layer == 'Layer 3') {
    //             page.emotionalCongruence.setValue(true)
    //             page.sexualPreOccupation.setValue(true)
    //             page.sexualInterests.setValue(true)
    //             page.victimSafetyPlanning.setValue(true)
    //             page.hostileOrientation.setValue(true)
    //         }
    //     }
    // }
}
