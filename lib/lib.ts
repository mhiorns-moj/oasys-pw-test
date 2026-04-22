import { Page, expect } from '@playwright/test'

import { OasysDateTime } from 'lib/oasysDateTime'
import { Utils } from 'lib/utils'

export function initialiseGlobals() {

    globalThis.expect = expect
    globalThis.oasysDateTime = new OasysDateTime()
    globalThis.utils = new Utils()
    globalThis.appConfig = null
    
    globalThis.waitForPageUpdate = async (page: Page, initialDelay?: number) => {
    
        let updatingElement = page.locator('*[class~="blockUI"],*[class~="u-Processing"]')
    
        await page.waitForTimeout(initialDelay ?? 250)
        let pleaseWaitCount = await updatingElement.count()
        while (pleaseWaitCount > 0) {
            pleaseWaitCount = await updatingElement.count()
        }
    }
}