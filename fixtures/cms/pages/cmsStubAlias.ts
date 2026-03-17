import { OasysPage, Element } from 'classes'

export class CmsStubAlias extends OasysPage {

    name = 'CMSStubAlias'
    title = 'Training - CMS Stub'

    delete = new Element.Button(this.page, 'Delete')
    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    surname = new Element.Textbox(this.page, '#P300_ALIAS_FAMILY_NAME')
    forename1 = new Element.Textbox(this.page, '#P300_ALIAS_FORENAME_1')
    forename2 = new Element.Textbox(this.page, '#P300_ALIAS_FORENAME_2')
    gender = new Element.Select(this.page, '#P300_ALIAS_GENDER_ELM')
    dateOfBirth = new Element.Textbox<OasysDate>(this.page, '#P300_ALIAS_DATE_OF_BIRTH', true)
}
