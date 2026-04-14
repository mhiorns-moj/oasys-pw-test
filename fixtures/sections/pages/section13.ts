import { BaseAssessmentPage, Element } from 'classes'

export class Section13 extends BaseAssessmentPage {

    name = 'Section13'
    title = '13 - Health and Other Considerations'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '13 - Health' }

    o13_1Details = new Element.Textbox(this.page, '#textarea_13_1_t_V2')

    async populateFull(maxStrings: boolean = false) {

        log('Fully populating section 13')
        await this.goto(true)
        await this.o13_1Details.setValue(maxStrings ? utils.oasysString(4000) : '13.1Details text')
    }
}


