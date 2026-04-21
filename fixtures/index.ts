import { test as base, TestInfo, expect, Page } from '@playwright/test'
import * as fs from 'fs-extra'

import { OasysDb } from './oasysDb/oasysDb'
import { testEnvironment } from 'localSettings'
import { Oasys } from './oasys/oasys'
import { Cms } from './cms/cms'
import { Offender } from './offender/offender'
import { Assessment } from './assessment/assessment'
import { Sections } from './sections/sections'
import { San } from './san/san'
import { Sns } from './sns/sns'
import { Tasks } from './tasks/tasks'
import { Risk } from './risk/risk'
import { SentencePlan } from './sentencePlan/sentencePlan'
import { Signing } from './signing/signing'
import { Sara } from './sara/sara'
import { Api } from './api/api'
import { Ogrs } from './ogrs/ogrs'
import { Maintenance } from './maintenance/maintenance'
import { OasysDateTime } from 'lib/oasysDateTime'
import { Utils } from 'lib/utils'

export { OasysDb } from './oasysDb/oasysDb'
export { Oasys } from './oasys/oasys'
export { Cms } from './cms/cms'
export { Offender } from './offender/offender'
export { Assessment } from './assessment/assessment'
export { Sections } from './sections/sections'
export { San } from './san/san'
export { Sns } from './sns/sns'
export { Tasks } from './tasks/tasks'
export { Risk } from './risk/risk'
export { SentencePlan } from './sentencePlan/sentencePlan'
export { Signing } from './signing/signing'
export { Sara } from './sara/sara'
export { Api } from './api/api'
export { Ogrs } from './ogrs/ogrs'
export { Maintenance } from './maintenance/maintenance'


const oasysLog: Log[] = []
const fileLog: string[] = []

globalThis.expect = expect
globalThis.oasysDateTime = new OasysDateTime()
globalThis.utils = new Utils()

globalThis.waitForPageUpdate = async (page: Page, initialDelay?: number) => {

    let updatingElement = page.locator('*[class~="blockUI"],*[class~="u-Processing"]')

    await page.waitForTimeout(initialDelay ?? 250)
    let pleaseWaitCount = await updatingElement.count()
    while (pleaseWaitCount > 0) {
        pleaseWaitCount = await updatingElement.count()
    }
}

globalThis.log = (logtext: string, type?: string) => {

    oasysLog.push({ logText: logtext, type: type })
}

globalThis.fileLog = (logtext: string) => {

    fileLog.push(logtext)
}

globalThis.appConfig = null

type OasysFixtures = {
    oasysDb: OasysDb,
    oasys: Oasys,
    cms: Cms,
    offender: Offender,
    assessment: Assessment,
    tasks: Tasks,
    sections: Sections,
    san: San, risk: Risk,
    sentencePlan: SentencePlan,
    signing: Signing,
    sara: Sara,
    sns: Sns,
    api: Api,
    ogrs: Ogrs,
    maintenance: Maintenance,
}

const fileLogFilename = 'test-results/fileLog.txt'

export const test = base.extend<OasysFixtures>({

    oasysDb: async ({ }, use: Function) => {

        const oasysDb = new OasysDb()
        appConfig = await oasysDb.getAppConfig()
        await oasysDb.getLatestElogAndUnprocEventTime('store')
        log(`OASys ${appConfig.currentVersion} (${testEnvironment.name})`, 'Environment')

        await use(oasysDb)

        await oasysDb.getLatestElogAndUnprocEventTime('check')
    },

    oasys: async ({ page }, use, testInfo) => {

        const oasys = new Oasys(page, testInfo)
        await page.goto(testEnvironment.url)

        await use(oasys)
    },

    cms: async ({ page, oasys }, use: Function, testInfo: TestInfo) => {
        const cms = new Cms(page, testInfo, oasys)
        await use(cms)
    },

    tasks: async ({ page, oasys }, use: Function, testInfo: TestInfo) => {
        const tasks = new Tasks(page, testInfo, oasys)
        await use(tasks)
    },

    offender: async ({ page, oasys, cms, oasysDb }, use: Function, testInfo: TestInfo) => {
        const offender = new Offender(page, testInfo, oasys, cms, oasysDb)
        await use(offender)
    },

    sections: async ({ page }, use: Function) => {
        const sections = new Sections(page)
        await use(sections)
    },

    san: async ({ page, oasys, oasysDb }, use: Function) => {
        const san = new San(page, oasys, oasysDb)
        await use(san)
    },

    risk: async ({ page, oasys, sara }, use: Function) => {
        const risk = new Risk(page, oasys, sara)
        await use(risk)
    },

    sentencePlan: async ({ page, oasys }, use: Function) => {
        const sentencePlan = new SentencePlan(page, oasys)
        await use(sentencePlan)
    },

    signing: async ({ page, oasys, tasks }, use: Function) => {
        const signing = new Signing(page, oasys, tasks)
        await use(signing)
    },

    assessment: async ({ page, oasys, cms, offender, oasysDb, sections, san, risk, sentencePlan, ogrs }, use: Function) => {
        const assessment = new Assessment(page, oasys, cms, offender, oasysDb, sections, san, risk, sentencePlan, ogrs)
        await use(assessment)
    },

    sns: async ({ page, oasys, oasysDb }, use: Function) => {
        const sns = new Sns(page, oasys, oasysDb)
        await use(sns)
    },

    sara: async ({ page, oasysDb }, use: Function) => {
        const sara = new Sara(page, oasysDb)
        await use(sara)
    },

    api: async ({ oasysDb, request }, use: Function) => {
        const api = new Api(oasysDb, request)
        await use(api)
    },

    ogrs: async ({ oasysDb }, use: Function) => {
        const ogrs = new Ogrs(oasysDb)
        await use(ogrs)
    },

    maintenance: async ({ page }, use: Function) => {
        const maintenance = new Maintenance(page)
        await use(maintenance)
    },
})

// TODO allow for parallel running
test.beforeEach(() => {

    fs.remove(fileLogFilename)
    oasysLog.length = 0
    fileLog.length = 0
})

test.afterEach(({ }, testInfo) => {

    for (let log of oasysLog) {
        testInfo.annotations.push({ type: (log.type ?? ''), description: `${log.type && log.logText != '' ? '\n' : ''}${log.logText}` })
    }
    if (fileLog.length > 0) {
        fs.writeFile(fileLogFilename, fileLog.join('\n'))
    }
})
