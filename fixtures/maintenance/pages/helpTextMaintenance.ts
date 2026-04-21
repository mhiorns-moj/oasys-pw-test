import { OasysPage, Element } from 'classes'

export class HelpTextMaintenance extends OasysPage {

    name = 'HelpTextMaintenance'

    preview = new Element.Button(this.page, 'Preview')
    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    itemDescription = new Element.Textbox(this.page, '#P20_ITEM_DESCRIPTION')
    introductionHelpText = new Element.TextEditor(this.page, '#P20_INTRO_DRAFT_LABEL')
    globalHelpText = new Element.TextEditor(this.page, '#P20_GLOBAL_HELP_DRAFT_LABEL')
    publish = new Element.Button(this.page, 'Publish')
    copyPublished = new Element.Button(this.page, 'Copy Published')
}
