export { expect } from '@playwright/test'

// export * as Api from './lib/api'
// export * as Ogrs from './lib/ogrs'
// export * as Pdf from './lib/pdf'
export { OasysDateTime } from './dateTime'
export * from './utils'


export const oasysLog: Log[] = []

export function log(logtext: string, type?: string) {

    oasysLog.push({ logText: logtext, type: type })
}
