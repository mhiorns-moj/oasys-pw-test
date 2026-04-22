import * as fs from 'fs-extra'
import { TestInfo } from '@playwright/test'

import { testEnvironment, userSuffixes } from 'localSettings'

const oasysLogs: { [key: number]: Log[] } = {}
const fileLog: { [key: number]: string[] } = {}

globalThis.log = (logtext: string, type?: string) => {

    const testProcess = Number.parseInt(process.env.TEST_PARALLEL_INDEX)
    oasysLogs[testProcess].push({ logText: logtext, type: type })
}

globalThis.fileLog = (logtext: string) => {

    const testProcess = Number.parseInt(process.env.TEST_PARALLEL_INDEX)
    fileLog[testProcess].push(logtext)
}

const fileLogFolder = 'logs/'

export class Logs {

    constructor(private readonly testInfo: TestInfo) { }

    async initialise() {

        const testProcesses = userSuffixes.length
        for (let i = 0; i < testProcesses; i++) {
            oasysLogs[i] = []
        }
        for (let i = 0; i < testProcesses; i++) {
            fileLog[i] = []
        }
        await fs.emptyDir(fileLogFolder)

    }

    async finalise() {

        const testProcess = Number.parseInt(process.env.TEST_PARALLEL_INDEX)
        for (let log of oasysLogs[testProcess]) {
            this.testInfo.annotations.push({ type: (log.type ?? ''), description: `${log.type && log.logText != '' ? '\n' : ''}${log.logText}` })
        }
        if (fileLog[testProcess].length > 0) {
            await fs.writeFile(`${fileLogFolder}${this.testInfo.title.replaceAll('/', '')}.txt`, fileLog[testProcess].join('\n'))
        }
    }

}