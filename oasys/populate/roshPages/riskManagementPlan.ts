import * as oasys from 'oasys'

export function minimal(earlyAllocation: boolean = false) {

    const page = new oasys.Pages.Rosh.RiskManagementPlan().goto(true)
    page.r11_1a.setValue('Yes')
    page.r11_1b.setValue('Yes')
    page.r11_1c.setValue('Yes')
    page.r11_1d.setValue('Yes')
    if (earlyAllocation) {
        page.r11_13.setValue('Automatic early allocation')
    }
}

export function minimalWithTextFields(earlyAllocation: boolean = false) {

    const page = new oasys.Pages.Rosh.RiskManagementPlan().goto(true)
    page.r11_1a.setValue('Yes')
    page.r11_1b.setValue('Yes')
    page.r11_1c.setValue('Yes')
    page.r11_1d.setValue('Yes')
    if (earlyAllocation) {
        page.r11_13.setValue('Automatic early allocation')
    }
    page.additionalComments.setValue('Some additional comments')
    page.furtherConsiderations.setValue('FurtherConsiderations')
    page.supervision.setValue('Supervision')
    page.monitoring.setValue('Monitoring')
    page.interventions.setValue('Interventions')
    page.victimSafety.setValue('VictimSafety')
    page.contingency.setValue('Contingency')
}

export function fullyPopulated(params?: PopulateAssessmentParams) {

    const page = new oasys.Pages.Rosh.RiskManagementPlan().goto(true)
    page.r11_1a.setValue('Yes')
    page.r11_1b.setValue('Yes')
    page.r11_1c.setValue('Yes')
    page.r11_1d.setValue('Yes')
    if (params?.provider) {
        page.r11_13.setValue('Automatic early allocation')
    }

    if (params?.layer != 'Layer 1V2') {
        rmpCheckboxes(page, params)

        page.additionalComments.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'Some additional comments')
        page.furtherConsiderations.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'FurtherConsiderations')
        page.supervision.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'Supervision')
        page.monitoring.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'Monitoring')
        page.interventions.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'Interventions')
        page.victimSafety.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'VictimSafety')
        page.contingency.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'Contingency')
    }
}

function rmpCheckboxes(page: oasys.Pages.Rosh.RiskManagementPlan, params?: PopulateAssessmentParams) {

    if (params?.layer != 'Layer 1V2') {
        page.weapons.setValue(true)
        page.arson.setValue(true)
        if (params?.layer == 'Layer 3') {
            page.accommodation.setValue(true)
            page.education.setValue(true)
            page.finances.setValue(true)
            page.relationships.setValue(true)
            page.lifestyle.setValue(true)
            page.drugs.setValue(true)
            page.alcohol.setValue(true)
            page.emotional.setValue(true)
            page.thinking.setValue(true)
            page.attitudes.setValue(true)
        }
        page.domesticAbuse.setValue(true)
        page.hateCrime.setValue(true)
        page.stalking.setValue(true)
        page.selfHarm.setValue(true)
        page.copingInCustody.setValue(true)
        page.vulnerability.setValue(true)
        page.escapeRisks.setValue(true)
        page.riskToChildren.setValue(true)
        page.riskToKnownAdult.setValue(true)
        page.riskToPrisoners.setValue(true)
        page.riskToStaff.setValue(true)
        if (params?.layer == 'Layer 3') {
            page.emotionalCongruence.setValue(true)
            page.sexualPreOccupation.setValue(true)
            page.sexualInterests.setValue(true)
            page.victimSafetyPlanning.setValue(true)
            page.hostileOrientation.setValue(true)
        }
    }
}