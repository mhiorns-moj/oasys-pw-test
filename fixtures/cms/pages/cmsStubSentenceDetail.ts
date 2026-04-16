import { OasysPage, Element } from 'classes'

export class CmsStubSentenceDetail extends OasysPage {

    name = 'CMSStubSentenceDetail'
    title = 'Training - CMS Stub'

    delete = new Element.Button(this.page, 'Delete')
    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    detailCategory = new Element.Select(this.page, '#P500_SENTENCE_ATTRIBUTE_CAT')
    detailType = new Element.Select(this.page, '#P500_SENTENCE_ATTRIBUTE_ELM')
    lengthHours = new Element.Textbox(this.page, '#P500_LENGTH_IN_HOURS')
    lengthMonths = new Element.Textbox(this.page, '#P500_LENGTH_IN_MONTHS')
    detailDescription = new Element.Textbox(this.page, '#P500_ACTIVITY_DESC')
    displayOrder = new Element.Textbox(this.page, '#P500_DISPLAY_SORT')
}
