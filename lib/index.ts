export { expect } from '@playwright/test'

export * from './autoData'
// export * as Api from './lib/api'
// export * as ArnsSp from './lib/arnsSp'
export * as Db from './db'
// export * as Errors from './lib/errors'
export * as OffenderLib from '../offenderLib'
// export * as Ogrs from './lib/ogrs'
// export * as Pdf from './lib/pdf'
// export * as San from './lib/san'
// export * as Sns from './lib/sns'
// export * as Task from './lib/task'
export * from '../users'
export { OasysDateTime } from './dateTime'


export const oasysLog: Log[] = []

export function log(logtext: string, type?: string) {

    oasysLog.push({ logText: logtext, type: type })
}
