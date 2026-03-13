import { BaseAssessmentPage, Element } from 'classes'
import * as lib from 'lib'

export class RoshSummary extends BaseAssessmentPage {

    name = 'RoshSummary'
    title = 'Risk of Serious Harm Summary'
    menu: Menu = { type: 'Floating', level1: 'RoSH Summary' }

    r10_1 = new Element.Textbox(this.page, '#textarea_SUM1')
    insertNames = new Element.Button(this.page, "//input[@type='button' and contains(@value,'Insert children')]")
    r10_2 = new Element.Textbox(this.page, '#textarea_SUM2')

    dcSrpBand = new Element.Text(this.page, "svg:contains('DC-SRP')>text:first")
    iicSrpBand = new Element.Text(this.page, "svg:contains('IIC-SRP')>text:first")
    csrpBand = new Element.Text(this.page, "svg:contains('CSRP')>text:first")
    csrpType = new Element.Text(this.page, "svg:contains('CSRP')>text:nth-of-type(2):first")
    csrpScore = new Element.Text(this.page, "svg:contains('CSRP')>text:nth-of-type(4):first")

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
}
