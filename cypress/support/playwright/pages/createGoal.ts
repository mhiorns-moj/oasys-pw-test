import * as SpClasses from '../classes'

export class CreateGoal extends SpClasses.SpPage {

    goal = new SpClasses.Textbox('#goal_title', this.browserPage)
    related = new SpClasses.Radiogroup<'yes' | 'no'>('#is_related_to_other_areas', this.browserPage, ['yes', 'no'])
    startNow = new SpClasses.Radiogroup<'yes' | 'no'>('#can_start_now', this.browserPage, ['yes', 'no'])
    targetDate = new SpClasses.Radiogroup<'3months' | '6months' | '12months' | 'other'>('#target_date_option', this.browserPage, ['3months', '6months', '12months', 'other'])
    addSteps = new SpClasses.Button('Add Steps', this.browserPage)
    saveWithoutSteps = new SpClasses.Button('Save without steps', this.browserPage)
}