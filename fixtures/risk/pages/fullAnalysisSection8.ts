import { BaseAssessmentPage, Element } from 'classes'

export class FullAnalysisSection8 extends BaseAssessmentPage {

    name = 'FullAnalysisSection8'
    title = 'Risk of Serious Harm Full Analysis'
    menu: Menu = { type: 'Floating', level1: 'RoSH Full Analysis', level2: 'Section 8' }

    suicideSelfHarm = new Element.Textbox(this.page, '#textarea_FA62')
    custodyAnalysis = new Element.Textbox(this.page, '#textarea_FA63')
    vulnerabilityAnalysis = new Element.Textbox(this.page, '#textarea_FA64')
    roshOthers = new Element.Select<YesNoAnswer>(this.page, '#itm_FA49')
    riskDetails = new Element.Textbox(this.page, '#textarea_FA49_t')



    async populateFull(params?: PopulateAssessmentParams) {

        log('Fully populating RoSH FA section 8')
        await this.goto(true)
        await this.goto(true)
        await this.suicideSelfHarm.setValue(params?.maxStrings ? utils.oasysString(4000) : 'SuicideHarmDetails')
        await this.custodyAnalysis.setValue(params?.maxStrings ? utils.oasysString(4000) : 'CustodyDetails')
        await this.vulnerabilityAnalysis.setValue(params?.maxStrings ? utils.oasysString(4000) : 'VulnerabilityDetails')
        await this.roshOthers.setValue('Yes')
        await this.riskDetails.setValue(params?.maxStrings ? utils.oasysString(4000) : 'RiskDetails')
    }

}
