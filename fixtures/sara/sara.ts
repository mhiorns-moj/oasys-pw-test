import { Page } from '@playwright/test'

import { OasysDb } from 'fixtures'
import * as pages from './pages'
import { Queries } from './queries'


export class Sara {


    constructor(private readonly page: Page, private readonly oasysDb: OasysDb) { }

    readonly sara = new pages.Sara(this.page)
    readonly reasonNoSara = new pages.ReasonNoSara(this.page)
    readonly deleteSaraPage = new pages.DeleteSara(this.page)

    readonly queries = new Queries(this.oasysDb)
    
    async populate(riskToPartner: 'Low' | 'Medium' | 'High', riskToOther: 'Low' | 'Medium' | 'High') {

        await this.sara.populate(riskToPartner, riskToOther)
    }

    async signAndLock() {

        await this.sara.signAndLock.click()
        await this.sara.confirmSignAndLock.click()
    }

    async cancelSara() {

        await this.reasonNoSara.goto(true)
        await this.reasonNoSara.reason.setValue('There was no suitably trained assessor available')
        await this.reasonNoSara.ok.click()
    }

    async deleteSara(comment = 'Testing') {

        await this.deleteSaraPage.goto()
        await this.deleteSaraPage.reasonForDeletion.setValue(comment)
        await this.deleteSaraPage.ok.click()
    }

}