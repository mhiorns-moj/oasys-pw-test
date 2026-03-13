import { test as base, mergeTests, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import * as oasysDb from 'lib/data/oasysDb'
import { testEnvironment } from 'localSettings'
import { Oasys } from './oasys/oasys'
import { Cms } from './cms/cms'
import { Offender } from './offender/offender'
import { Assessment } from './assessment'

export { Oasys } from './oasys/oasys'
export { Cms } from './cms/cms'
export { Offender } from './offender/offender'
export { Assessment } from './assessment'


export const oasys = base.extend<{ oasys: Oasys }>({

    oasys: async ({ page }, use, testInfo) => {

        const oasys = new Oasys(page, testInfo)

        oasys.appConfig = await oasysDb.getAppConfig()

        lib.log(`OASys ${oasys.appConfig.currentVersion} (${testEnvironment.name})`, 'Environment')
        console.log(`OASys version ${oasys.appConfig.currentVersion} in ${testEnvironment.name}`)
        await oasysDb.getLatestElogAndUnprocEventTime('store')

        await page.goto(testEnvironment.url)
        await use(oasys)

        await oasysDb.getLatestElogAndUnprocEventTime('check')
        await oasysDb.closeConnection()
        for (let log of lib.oasysLog) {
            oasys.testInfo.annotations.push({ type: (log.type ?? ''), description: `${log.type ? '\n' : ''}${log.logText}` })
        }
    }
})

export const cms = oasys.extend<{ oasys: Oasys, cms: Cms }>({

    cms: async ({ page, oasys }, use: Function, testInfo: TestInfo) => {

        const cms = new Cms(page, testInfo, oasys)
        await use(cms)
    }
})

export const offender = oasys.extend<{ oasys: Oasys, cms: Cms, offender: Offender }>({

    offender: async ({ page, oasys, cms }, use: Function, testInfo: TestInfo) => {

        const offender = new Offender(page, testInfo, oasys, cms)
        await use(offender)
    }
})

export const assessment = oasys.extend<{ oasys: Oasys, cms: Cms, offender: Offender, assessment: Assessment }>({

    assessment: async ({ page, oasys, cms, offender }, use: Function, testInfo: TestInfo) => {

        const assessment = new Assessment(page, testInfo, oasys, cms, offender)
        await use(assessment)
    }
})

export const test = mergeTests(oasys, cms, offender, assessment)