import { OasysPage, Element } from 'classes'

export class PrintBlankSaq extends OasysPage {

    name = 'PrintBlankSAQ'
    title = 'Print Blank SAQ'
    menu: Menu = { type: 'Main', level1: 'Print Template', level2: 'Print Blank SAQ' }

    selectLanguage = new Element.Select(this.page, '#P100_SAQ_FILENAME_LOV')
    print = new Element.Button(this.page, 'Print')
    cancel = new Element.Button(this.page, 'Cancel')
}
