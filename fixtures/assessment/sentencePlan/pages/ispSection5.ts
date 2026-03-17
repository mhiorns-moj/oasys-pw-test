import { OasysPage, Element } from 'classes'
import { SentencePlan } from './sentencePlan'
import * as CommonTables from 'fixtures/pagesFromCypress/commonTables'

export class IspSection5 extends SentencePlan {

    name = 'ISPSection5'
    title = 'Offender Objectives'
    menu: Menu = { type: 'Floating', level1: 'Initial Sentence Plan', level2: 'Section 5' }

    current = new Element.Link(this.page, 'Current')
    future = new Element.Link(this.page, 'Future')
    completed = new Element.Link(this.page, 'Completed')
    objectiveDescriptionColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Objective Description')
    statusColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Status')
    upColumn = new Element.Column(this.page, Element.ColumnType.ImageColumn, 'Up')
    downColumn = new Element.Column(this.page, Element.ColumnType.ImageColumn, 'Down')
    addObjective = new Element.Button(this.page, 'Add Objective')
    clearCurrentObjectives = new Element.Button(this.page, 'Clear Current Objectives')

    criminogenicNeedsSummary = new Element.Link(this.page, '[accesskey="4"]')
    ogrs3 = new Element.Link(this.page, '[accesskey="5"]')
    rosh = new Element.Link(this.page, '[accesskey="6"]')
    riskManagement = new Element.Link(this.page, '[accesskey="7"]')

    sanCrimTable = new CommonTables.SummarySheetCrimTable(this.page, 'R3982355349224802', 'ISP SAN Criminogenic Needs')

    predictorsTable = new CommonTables.PredictorsTable(this.page, 'R3328116188259315', 'Isp Predictor Scores')
    weighedScoresTable = new CommonTables.WeightedScoresTable(this.page, 'R2896618293122266', 'Isp Weighted Scores')
}
