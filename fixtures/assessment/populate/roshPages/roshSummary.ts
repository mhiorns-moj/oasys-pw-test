import * as oasys from 'lib'

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Rosh.RoshSummary().goto(true)
    page.r10_1.setValue(maxStrings ? oasys.oasysString(4000) : 'R10.1 details')
    page.r10_2.setValue(maxStrings ? oasys.oasysString(4000) : 'R10.2 details')
    page.riskFactorAnslysis.setValue(maxStrings ? oasys.oasysString(4000) : 'Risk factor analysis')
    page.r10_5.setValue(maxStrings ? oasys.oasysString(4000) : 'R10.5 details')
    page.r10_3.setValue(maxStrings ? oasys.oasysString(4000) : 'R10.3 details')
    page.r10_6ChildrenCommunity.setValue('Low')
    page.r10_6ChildrenCustody.setValue('High')
    page.r10_6PublicCommunity.setValue('Medium')
    page.r10_6PublicCustody.setValue('Low')
    page.r10_6AdultCommunity.setValue('High')
    page.r10_6AdultCustody.setValue('Medium')
    page.r10_6StaffCommunity.setValue('Low')
    page.r10_6StaffCustody.setValue('Very High')
    page.r10_6PrisonersCustody.setValue('High')
    page.details.setValue(maxStrings ? oasys.oasysString(4000) : 'Some details about documents and reports')
}

/**
 * Sets risk flags to the risk level specified, and enters some basic text on the other fields.
 */
export function specificRiskLevel(risk: RiskLevel) {

    const page = new oasys.Pages.Rosh.RoshSummary().goto(true)
    page.r10_1.setValue('R10.1 details')
    page.r10_2.setValue('R10.2 details')
    page.riskFactorAnslysis.setValue('Risk factor analysis')
    page.r10_5.setValue('R10.5 details')
    page.r10_3.setValue('R10.3 details')
    page.r10_6ChildrenCommunity.setValue(risk)
    page.r10_6ChildrenCustody.setValue(risk)
    page.r10_6PublicCommunity.setValue(risk)
    page.r10_6PublicCustody.setValue(risk)
    page.r10_6AdultCommunity.setValue(risk)
    page.r10_6AdultCustody.setValue(risk)
    page.r10_6StaffCommunity.setValue(risk)
    page.r10_6StaffCustody.setValue(risk)
    page.r10_6PrisonersCustody.setValue(risk)
}