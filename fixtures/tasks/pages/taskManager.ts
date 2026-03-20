import { OasysPage, Element } from 'classes'

export class TaskManager extends OasysPage {

    name = 'TaskManager'
    title = 'Task Manager'
    menu: Menu = { type: 'Main', level1: 'Tasks' }

    localAdministrationUnit = new Element.Select(this.page, '#P1_DIVISION_CODE')
    team = new Element.Select(this.page, '#P1_TEAM_UK')
    userName = new Element.Lov(this.page, '#P1_OASYS_USER_CODE_LABEL')
    taskName = new Element.Select(this.page, '#P1_TASK_TYPE_ELM')
    offenderName = new Element.Lov(this.page, '#P1_OFFENDER_PK_LABEL')
    showCompleted = new Element.Select(this.page, '#P1_SHOW_COMPLETED')
    resultsPerPage = new Element.Select(this.page, '#P1_RESULTS_PER_PAGE')
    search = new Element.Button(this.page, 'Search')
    taskList = new TaskList(this.page, 'R6622119977925483', 'Task List')
}

export class TaskList extends Element.Table {

    statusColumn = new Element.Column(this.page, Element.ColumnType.ImageColumn, `#ICONS_${this.id}`, this.id)
    surnameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Surname', this.id)
    forenameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Forename', this.id)
    pNCColumn = new Element.Column(this.page, Element.ColumnType.Column, 'PNC', this.id)
    usernameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Username', this.id)
    taskNameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Task Name', this.id)
    teamColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Team', this.id)
    dateDueColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Date Due', this.id)
    completedColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Completed?', this.id)
}