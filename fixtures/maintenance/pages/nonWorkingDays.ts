import { OasysPage, Element } from 'classes'

export class NonWorkingDays extends OasysPage {

    name = 'NonWorkingDays'
    title = 'Non-Working Days Maintenance'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Non-Working Days' }

    close = new Element.Button(this.page, 'Close')
    nonWorkingDate = new Element.Textbox<OasysDate>(this.page, '#P7_NON_WORKING_DAY', true)
    description = new Element.Textbox(this.page, '#P7_NON_WORKING_DATE_DESC')
    setAsNonWorkingDay = new Element.Button(this.page, 'Set As Non-Working')
}
