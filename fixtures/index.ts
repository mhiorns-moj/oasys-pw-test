import { test as base, mergeTests, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { OasysDb } from './oasysDb/oasysDb'
import { testEnvironment } from 'localSettings'
import { Oasys } from './oasys/oasys'
import { Cms } from './cms/cms'
import { Offender } from './offender/offender'
import { Assessment } from './assessment'
import { Sns } from './sns/sns'
import { Tasks } from './tasks/tasks'

export { OasysDb } from './oasysDb/oasysDb'
export { Oasys } from './oasys/oasys'
export { Cms } from './cms/cms'
export { Offender } from './offender/offender'
export { Assessment } from './assessment'
export { Sns } from './sns/sns'
export { Tasks } from './tasks/tasks'


export const oasysDb = base.extend<{ oasysDb: OasysDb }>({

    oasysDb: async ({ }, use: Function, testInfo: TestInfo) => {

        const oasysDb = new OasysDb()
        await use(oasysDb)
    }
})

export const oasys = base.extend<{ oasys: Oasys, oasysDb: OasysDb }>({

    oasys: async ({ page, oasysDb }, use, testInfo) => {

        const oasys = new Oasys(page, testInfo)

        oasys.appConfig = await oasysDb.getAppConfig()

        lib.log(`OASys ${oasys.appConfig.currentVersion} (${testEnvironment.name})`, 'Environment')
        await oasysDb.getLatestElogAndUnprocEventTime('store')

        await page.goto(testEnvironment.url)
        await use(oasys)

        await oasysDb.getLatestElogAndUnprocEventTime('check')
        await oasysDb.closeConnection()
        for (let log of lib.oasysLog) {
            oasys.testInfo.annotations.push({ type: (log.type ?? ''), description: `${log.type && log.logText != '' ? '\n' : ''}${log.logText}` })
        }
    }
})


export const cms = oasys.extend<{ oasys: Oasys, cms: Cms }>({

    cms: async ({ page, oasys }, use: Function, testInfo: TestInfo) => {

        const cms = new Cms(page, testInfo, oasys)
        await use(cms)
    }
})

export const tasks = oasys.extend<{ oasys: Oasys, tasks: Tasks }>({

    tasks: async ({ page, oasys }, use: Function, testInfo: TestInfo) => {

        const tasks = new Tasks(page, testInfo, oasys)
        await use(tasks)
    }
})

export const offender = oasys.extend<{ oasys: Oasys, cms: Cms, offender: Offender, oasysDb: OasysDb }>({

    offender: async ({ page, oasys, cms, oasysDb }, use: Function, testInfo: TestInfo) => {

        const offender = new Offender(page, testInfo, oasys, cms, oasysDb)
        await use(offender)
    }
})

export const assessment = oasys.extend<{ oasys: Oasys, cms: Cms, offender: Offender, assessment: Assessment, oasysDb: OasysDb, tasks: Tasks }>({

    assessment: async ({ page, oasys, cms, offender, oasysDb, tasks }, use: Function, testInfo: TestInfo) => {

        const assessment = new Assessment(page, testInfo, oasys, cms, offender, oasysDb, tasks)
        await use(assessment)
    }
})

export const sns = oasys.extend<{ oasys: Oasys, oasysDb: OasysDb, sns: Sns }>({

    sns: async ({ page, oasys, oasysDb }, use: Function) => {

        const sns = new Sns(page, oasys, oasysDb)
        await use(sns)
    }
})

export const test = mergeTests(oasys, cms, offender, assessment, oasysDb, sns, tasks)