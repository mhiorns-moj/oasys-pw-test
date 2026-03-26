import { Expect, Page } from '@playwright/test'

import { OasysDateTime } from 'lib/oasysDateTime'
import { Utils } from 'lib/utils'

declare global {

    var expect: Expect<{}>
    var oasysDateTime: OasysDateTime
    var utils: Utils
    var waitForPageUpdate: (page: Page, initialDelay?: number) => Promise<void>
    var log: (logtext: string, type?: string) => void
}
