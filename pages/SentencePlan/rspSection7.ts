import { OasysPage, Element } from 'classes'
import { SentencePlan } from './sentencePlan'
import * as CommonTables from 'pages/commonTables'

export class RspSection7 extends SentencePlan {

    name = 'RSPSection7'
    title = 'Offender Objectives'
    menu: Menu = { type: 'Floating', level1: 'Review Sentence Plan', level2: 'Section 7' }

    current = new Element.Link(this.page, 'Current')
    future = new Element.Link(this.page, 'Future')
    completed = new Element.Link(this.page, 'Completed')
    objectives = new CommonTables.ObjectivesTable('R7307124677951782', 'Objectives')
    addObjective = new Element.Button(this.page, 'Add Objective')
    clearCurrentObjectives = new Element.Button(this.page, 'Clear Current Objectives')

    crimNeedTab = new Element.Link(this.page, 'a[accesskey="4"]')
    predictorsTab = new Element.Link(this.page, 'a[accesskey="5"]')
    roshSummaryTab = new Element.Link(this.page, 'a[accesskey="6"]')
    riskManagementTab = new Element.Link(this.page, 'a[accesskey="7"]')

    crimNeedTable = new RspCrimNeedTable('R3720403791960688', 'RSP Criminogenic Needs')
    sanCrimNeedTable = new RspCrimNeedTable('R3982355349224802', 'RSP SAN Criminogenic Needs')
    predictorsTable = new CommonTables.PredictorsTable('R3328116188259315', 'RSP Predictor Scores')
    weightedScoresTable = new CommonTables.WeightedScoresTable('R2896618293122266', 'RSP Weighted Scores')

    r10_1 = new Element.Textbox(this.page, '#textarea_SUM1')
    r10_2 = new Element.Textbox(this.page, '#textarea_SUM2')
    ospIic = new Element.Textbox(this.page, '#textarea_D3')
    ospDc = new Element.Textbox(this.page, '#textarea_D4')
    rsrScore = new Element.Textbox(this.page, '#textarea_D3')
    r10_3 = new Element.Textbox(this.page, '#textarea_SUM3')
    r10_5 = new Element.Textbox(this.page, '#textarea_SUM10')

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
    safeguardingPlan = new Element.Checkbox(this.page, '#itm_RM28_0_16_1_YES')
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
}

export class RspCrimNeedTable extends Element.Table {

    oasysSection = new Element.Column(this.page, Element.ColumnType.Column, `#OASYS_SECTION_${this.page.id}`, this.page.id)
    linkedToRosh = new Element.Column(this.page, Element.ColumnType.Column, `#LINKED_TO_RISK_SH_${this.page.id}`, this.page.id)
    linkedToReoffending = new Element.Column(this.page, Element.ColumnType.Column, `#LINKED_TO_RISK_RO_${this.page.id}`, this.page.id)
    strengths = new Element.Column(this.page, Element.ColumnType.Column, `#RELATED_STRENGTHS_${this.page.id}`, this.page.id)
    criminogenicNeed = new Element.Column(this.page, Element.ColumnType.Column, `#CRIMINOGENIC_NEED_${this.page.id}`, this.page.id)
    scores = new Element.Column(this.page, Element.ColumnType.ScoresColumn, `#SECTION_SCORES_${this.page.id}`, this.page.id)
    lowScoringAreas = new Element.Column(this.page, Element.ColumnType.Column, `#LOW_SCORE_ATTN_${this.page.id}`, this.page.id)
    indentifiedOnSAQ = new Element.Column(this.page, Element.ColumnType.Column, `#ID_ON_SAQ_${this.page.id}`, this.page.id)
}
