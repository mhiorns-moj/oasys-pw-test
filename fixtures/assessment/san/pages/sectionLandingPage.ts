import { Page } from '@playwright/test'
import { OasysPage, Element } from 'classes'
import * as lib from 'lib'

export class SectionLandingPage extends OasysPage {

    name = ''
    title = ''

    menu: Menu = { type: 'San', level1: '' }

    information = new Element.Link(this.page, 'Information')
    analysis = new Element.Link(this.page, 'Practitioner analysis')

    constructor(public readonly page: Page, section: SanSection) {

        super(page)
        this.name = section
        this.menu.level1 = section
        if (section == 'Drug use') {
            this.title = 'Drug use background - Strengths and needs'
        } else {
            this.title = `${section} - Strengths and needs`
        }
    }
}
