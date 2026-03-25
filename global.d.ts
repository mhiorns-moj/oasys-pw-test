import { Expect, Page } from '@playwright/test'

import { OasysDateTime } from 'lib/oasysDateTime'

declare global {

    var log: (logtext: string, type?: string) => void
    var oasysDateTime: OasysDateTime
    var expect: Expect<{}>
    var waitForPageUpdate: (page: Page, initialDelay?: number) => Promise<void>
}
