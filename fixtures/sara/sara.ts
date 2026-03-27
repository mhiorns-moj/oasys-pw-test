import { Page } from '@playwright/test'

import { Oasys } from 'fixtures'
import * as pages from './pages'


export class Sara {


    constructor(private readonly page: Page, private readonly oasys: Oasys) { }

    readonly sara = new pages.Sara(this.page)
    readonly reasonNoSara = new pages.ReasonNoSara(this.page)

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

}