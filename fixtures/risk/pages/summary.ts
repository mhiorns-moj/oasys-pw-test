import { BaseAssessmentPage, Element } from 'classes'

export class Summary extends BaseAssessmentPage {

    name = 'RoshSummary'
    title = 'Risk of Serious Harm Summary'
    menu: Menu = { type: 'Floating', level1: 'RoSH Summary' }

    r10_1 = new Element.Textbox(this.page, '#textarea_SUM1')
    insertNames = new Element.Button(this.page, "//input[@type='button' and contains(@value,'Insert children')]")
    r10_2 = new Element.Textbox(this.page, '#textarea_SUM2')

    dcSrpBand = new Element.Text(this.page, ":nth-match(svg:has-text('DC-SRP')>text,1)")
    iicSrpBand = new Element.Text(this.page, ":nth-match(svg:has-text('IIC-SRP')>text,1)")
    csrpBand = new Element.Text(this.page, ":nth-match(svg:has-text('CSRP')>text,1)")
    csrpType = new Element.Text(this.page, ":nth-match(svg:has-text('CSRP')>text:nth-of-type(2),1)")
    csrpScore = new Element.Text(this.page, ":nth-match(svg:has-text('CSRP')>text:nth-of-type(4),1)")

    riskFactorAnslysis = new Element.Textbox(this.page, '#textarea_SUM9')
    r10_5 = new Element.Textbox(this.page, '#textarea_SUM10')
    r10_3 = new Element.Textbox(this.page, '#textarea_SUM11')

    r10_6ChildrenCommunity = new Element.Select<RiskLevel>(this.page, '#itm_SUM6_1_1')
    r10_6ChildrenCustody = new Element.Select<RiskLevel>(this.page, '#itm_SUM6_1_2')
    r10_6PublicCommunity = new Element.Select<RiskLevel>(this.page, '#itm_SUM6_2_1')
    r10_6PublicCustody = new Element.Select<RiskLevel>(this.page, '#itm_SUM6_2_2')
    r10_6AdultCommunity = new Element.Select<RiskLevel>(this.page, '#itm_SUM6_3_1')
    r10_6AdultCustody = new Element.Select<RiskLevel>(this.page, '#itm_SUM6_3_2')
    r10_6StaffCommunity = new Element.Select<RiskLevel>(this.page, '#itm_SUM6_4_1')
    r10_6StaffCustody = new Element.Select<RiskLevel>(this.page, '#itm_SUM6_4_2')
    r10_6PrisonersCustody = new Element.Select<RiskLevel>(this.page, '#itm_SUM6_5_2')
    details = new Element.Textbox(this.page, '#textarea_SUM8')


    async populateWithSpecificRiskLevel(risk: RiskLevel) {

        log(`RoSH summary - ${risk} risk`)
        await this.goto(true)

        await this.r10_1.setValue('R10.1 details')
        await this.r10_2.setValue('R10.2 details')
        await this.riskFactorAnslysis.setValue('Risk factor analysis')
        await this.r10_5.setValue('R10.5 details')
        await this.r10_3.setValue('R10.3 details')
        await this.r10_6ChildrenCommunity.setValue(risk)
        await this.r10_6ChildrenCustody.setValue(risk)
        await this.r10_6PublicCommunity.setValue(risk)
        await this.r10_6PublicCustody.setValue(risk)
        await this.r10_6AdultCommunity.setValue(risk)
        await this.r10_6AdultCustody.setValue(risk)
        await this.r10_6StaffCommunity.setValue(risk)
        await this.r10_6StaffCustody.setValue(risk)
        await this.r10_6PrisonersCustody.setValue(risk)
    }

    async populateFull(maxStrings: boolean = false) {

        log('Fully populated RoSH summary')
        await this.goto(true)

        await this.r10_1.setValue(maxStrings ? utils.oasysString(4000) : 'R10.1 details')
        await this.r10_2.setValue(maxStrings ? utils.oasysString(4000) : 'R10.2 details')
        await this.riskFactorAnslysis.setValue(maxStrings ? utils.oasysString(4000) : 'Risk factor analysis')
        await this.r10_5.setValue(maxStrings ? utils.oasysString(4000) : 'R10.5 details')
        await this.r10_3.setValue(maxStrings ? utils.oasysString(4000) : 'R10.3 details')
        await this.r10_6ChildrenCommunity.setValue('Low')
        await this.r10_6ChildrenCustody.setValue('High')
        await this.r10_6PublicCommunity.setValue('Medium')
        await this.r10_6PublicCustody.setValue('Low')
        await this.r10_6AdultCommunity.setValue('High')
        await this.r10_6AdultCustody.setValue('Medium')
        await this.r10_6StaffCommunity.setValue('Low')
        await this.r10_6StaffCustody.setValue('Very High')
        await this.r10_6PrisonersCustody.setValue('High')
        await this.details.setValue(maxStrings ? utils.oasysString(4000) : 'Some details about documents and reports')
    }
}
