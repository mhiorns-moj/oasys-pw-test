import { Page, TestInfo } from '@playwright/test'

import { Oasys } from 'fixtures'
import * as pages from './pages'

import { Lov, Select } from 'classes/elements'

export class Tasks {

    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys) { }

    readonly taskManager = new pages.TaskManager(this.page)
    readonly assessmentWipTask = new pages.AssessmentWipTask(this.page)
    readonly countersignatureTask = new pages.CountersignatureTask(this.page)




    /**
     * Search the tasks page for a countersigning task for the given offender (specified as an OffenderDef object),
     * then opens the assessment.  Assumes you are already on the task manager page.
     */
    async openAssessmentFromCountersigningTask(offender: OffenderDef) {

        await this.search({ taskName: 'Countersignature Required', offenderName: offender.surname })
        await this.taskManager.taskList.clickFirstRow()

        await this.oasys.clickButton('Open Assessment')
        log(`Opened assessment from countersigning task for ${offender.forename1} ${offender.surname}`)
    }

    /**
     * Search the tasks page for a countersigning task for the given offender surname,
     * then opens the assessment.  Assumes you are already on the task manager page.
     */
    async openAssessmentFromCountersigningTaskByName(surname: string) {

        await this.search({ taskName: 'Countersignature Required', offenderName: surname })
        await this.taskManager.taskList.clickFirstRow()

        await this.oasys.clickButton('Open Assessment')
        log(`Opened assessment from countersigning task for ${surname}`)
    }

    /**
     * Resets the search fields to blank (or `- All -`) if required, to avoid incorrect filtering of the available values,
     * then enters the search values specified in a name/value table and clicks the search button.
    */
    async search(values: TaskSearch) {

        // clear filters initially to avoid incorrect filtering of task types and offenders
        await this.resetFilterIfRequired(this.taskManager.localAdministrationUnit)
        await this.resetFilterIfRequired(this.taskManager.team)
        await this.resetFilterIfRequired(this.taskManager.userName)
        await this.resetFilterIfRequired(this.taskManager.taskName)
        await this.resetFilterIfRequired(this.taskManager.offenderName)

        await this.taskManager.setValues(values)
        await this.oasys.clickButton('Search', false)
    }

    async resetFilterIfRequired(filter: Lov | Select<string>) {

        const value = await filter.getValue()
        if (value != '- All -' && value != '') {
            await filter.setValue('- All -')
        }
    }

    /**
     * Clicks the first row in the task list
     */
    async selectFirstTask() {

        await this.taskManager.taskList.clickFirstRow()
        log('Selected first task')
    }

    /**
     * Search the tasks page for a merge task for the given offender surname,
     * then grants the merge.  Assumes you are already on the task manager page.
     */
    // async grantMerge(surname: string) {

    //     const page = new oasys.Pages.Tasks.TaskManager()
    //     search({ taskName: 'Pending Merge - Decision Required', offenderName: surname })
    //     page.taskList.clickFirstRow()

    //     await oasys.clickButton('Grant but Retain Ownership')
    //     log(`Granted merge for ${surname}`)
    // }
}
