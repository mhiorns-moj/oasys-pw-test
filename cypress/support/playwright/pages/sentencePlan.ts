import * as SpClasses from '../classes'

export class SentencePlan extends SpClasses.SpPage {

    returnToOASys = new SpClasses.Button('Return to OASys', this.browserPage)
    createGoal = new SpClasses.Button('Create goal', this.browserPage)
    agreePlan = new SpClasses.Button('Agree plan', this.browserPage)
    currentGoalCount = new SpClasses.Link('Goals to work on now (', this.browserPage)
    futureGoalCount = new SpClasses.Link('Future goals (', this.browserPage)
}