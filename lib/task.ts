/**
 * __oasys.Task.*function*__  
 * 
 * Functions for dealing with tasks.
 * 
 * @module Task utils
 */

import { Lov, Select } from 'classes/elements'
import * as oasys from 'lib'


/**
 * Search the tasks page for a countersigning task for the given offender (specified as a Cypress alias, e.g. '@offender1'),
 * then opens the assessment.  Assumes you are already on the task manager page.
 */
export function openAssessmentFromCountersigningTask(alias: string) {

    cy.get<OffenderDef>(alias).then((offender) => {

        const page = new oasys.Pages.Tasks.TaskManager()
        search({ taskName: 'Countersignature Required', offenderName: offender.surname })
        page.taskList.clickFirstRow()

        oasys.Nav.clickButton('Open Assessment')
        cy.log(`Opened assessment from countersigning task for ${offender.forename1} ${offender.surname}`)
    })
}

/**
 * Search the tasks page for a countersigning task for the given offender surname,
 * then opens the assessment.  Assumes you are already on the task manager page.
 */
export function openAssessmentFromCountersigningTaskByName(surname: string) {

    const page = new oasys.Pages.Tasks.TaskManager()
    search({ taskName: 'Countersignature Required', offenderName: surname, showCompleted: 'No' })
    page.taskList.clickFirstRow()

    oasys.Nav.clickButton('Open Assessment')
    cy.log(`Opened assessment from countersigning task for ${surname}`)
}

/**
 * Resets the search fields to blank (or `- All -`) if required, to avoid incorrect filtering of the available values,
 * then enters the search values specified in a name/value table and clicks the search button.
*/
export function search(values: TaskSearch) {

    const page = new oasys.Pages.Tasks.TaskManager()
    // clear filters initially to avoid incorrect filtering of task types and offenders
    resetFilterIfRequired(page.localAdministrationUnit)
    resetFilterIfRequired(page.team)
    resetFilterIfRequired(page.userName)
    resetFilterIfRequired(page.taskName)
    resetFilterIfRequired(page.offenderName)

    page.setValues(values)
    oasys.Nav.clickButton('Search', false)
}

function resetFilterIfRequired(filter: Lov | Select<string>) {

    filter.getValue('valueAlias')
    cy.get<string>('@valueAlias').then((value) => {
        if (value != '- All -' && value != '')
            filter.setValue('- All -')
    })
}

/**
 * Clicks the first row in the task list
 */
export function selectFirstTask() {

    new oasys.Pages.Tasks.TaskManager().taskList.clickFirstRow()
    cy.log('Selected first task')
}

/**
 * Search the tasks page for a merge task for the given offender surname,
 * then grants the merge.  Assumes you are already on the task manager page.
 */
export function grantMerge(surname: string) {

    const page = new oasys.Pages.Tasks.TaskManager()
    search({ taskName: 'Pending Merge - Decision Required', offenderName: surname })
    page.taskList.clickFirstRow()

    oasys.Nav.clickButton('Grant but Retain Ownership')
    cy.log(`Granted merge for ${surname}`)
}