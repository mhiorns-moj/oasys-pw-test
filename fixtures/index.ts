import { test as base, mergeTests, TestInfo, expect, Page } from '@playwright/test'

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


const oasysLog: Log[] = []

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
}


export const test = base.extend<OasysFixtures>({

    oasysDb: async ({ }, use: Function) => {
        const oasysDb = new OasysDb()
        await use(oasysDb)
    },

    oasys: async ({ page, oasysDb }, use, testInfo) => {

        const oasys = new Oasys(page, testInfo)
        oasysLog.length = 0
        oasys.appConfig = await oasysDb.getAppConfig()

        log(`OASys ${oasys.appConfig.currentVersion} (${testEnvironment.name})`, 'Environment')
        await oasysDb.getLatestElogAndUnprocEventTime('store')

        await page.goto(testEnvironment.url)
        await use(oasys)

        await oasysDb.getLatestElogAndUnprocEventTime('check')
        await oasysDb.closeConnection()
        for (let log of oasysLog) {
            testInfo.annotations.push({ type: (log.type ?? ''), description: `${log.type && log.logText != '' ? '\n' : ''}${log.logText}` })
        }
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

    assessment: async ({ page, oasys, cms, offender, oasysDb, sections, san, risk, sentencePlan }, use: Function) => {
        const assessment = new Assessment(page, oasys, cms, offender, oasysDb, sections, san, risk, sentencePlan)
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
})