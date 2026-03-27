import { BaseAssessmentPage, Element } from 'classes'

export class Rmp extends BaseAssessmentPage {

    name = 'RMP'
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


    async populateMinimal(earlyAllocation: boolean = false) {

        log('Minimally populating Risk Management Plan')
        await this.goto(true)

        await this.r11_1a.setValue('Yes')
        await this.r11_1b.setValue('Yes')
        await this.r11_1c.setValue('Yes')
        await this.r11_1d.setValue('Yes')
        if (earlyAllocation) {
            await this.r11_13.setValue('Automatic early allocation')
        }
    }

    async populateMinimalWithTextFields(earlyAllocation: boolean = false) {

        await this.populateMinimal(earlyAllocation)
        await this.additionalComments.setValue('Some additional comments')
        await this.furtherConsiderations.setValue('FurtherConsiderations')
        await this.supervision.setValue('Supervision')
        await this.monitoring.setValue('Monitoring')
        await this.interventions.setValue('Interventions')
        await this.victimSafety.setValue('VictimSafety')
        await this.contingency.setValue('Contingency')
    }

    async populateFull(params?: PopulateAssessmentParams) {

        log('Minimally populating Risk Management Plan')
        await this.goto(true)
        await this.r11_1a.setValue('Yes')
        await this.r11_1b.setValue('Yes')
        await this.r11_1c.setValue('Yes')
        await this.r11_1d.setValue('Yes')
        if (params?.provider) {
            await this.r11_13.setValue('Automatic early allocation')
        }

        if (params?.layer != 'Layer 1V2') {
            await this.populateCheckboxes(params)

            await this.additionalComments.setValue(params?.maxStrings ? utils.oasysString(4000) : 'Some additional comments')
            await this.furtherConsiderations.setValue(params?.maxStrings ? utils.oasysString(4000) : 'FurtherConsiderations')
            await this.supervision.setValue(params?.maxStrings ? utils.oasysString(4000) : 'Supervision')
            await this.monitoring.setValue(params?.maxStrings ? utils.oasysString(4000) : 'Monitoring')
            await this.interventions.setValue(params?.maxStrings ? utils.oasysString(4000) : 'Interventions')
            await this.victimSafety.setValue(params?.maxStrings ? utils.oasysString(4000) : 'VictimSafety')
            await this.contingency.setValue(params?.maxStrings ? utils.oasysString(4000) : 'Contingency')
        }
    }

    async populateCheckboxes(params?: PopulateAssessmentParams) {

        if (params?.layer != 'Layer 1V2') {
            await this.weapons.setValue(true)
            await this.arson.setValue(true)
            if (params?.layer == 'Layer 3') {
                await this.accommodation.setValue(true)
                await this.education.setValue(true)
                await this.finances.setValue(true)
                await this.relationships.setValue(true)
                await this.lifestyle.setValue(true)
                await this.drugs.setValue(true)
                await this.alcohol.setValue(true)
                await this.emotional.setValue(true)
                await this.thinking.setValue(true)
                await this.attitudes.setValue(true)
            }
            await this.domesticAbuse.setValue(true)
            await this.hateCrime.setValue(true)
            await this.stalking.setValue(true)
            await this.selfHarm.setValue(true)
            await this.copingInCustody.setValue(true)
            await this.vulnerability.setValue(true)
            await this.escapeRisks.setValue(true)
            await this.riskToChildren.setValue(true)
            await this.riskToKnownAdult.setValue(true)
            await this.riskToPrisoners.setValue(true)
            await this.riskToStaff.setValue(true)
            if (params?.layer == 'Layer 3') {
                await this.emotionalCongruence.setValue(true)
                await this.sexualPreOccupation.setValue(true)
                await this.sexualInterests.setValue(true)
                await this.victimSafetyPlanning.setValue(true)
                await this.hostileOrientation.setValue(true)
            }
        }
    }
}
