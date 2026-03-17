export { expect } from '@playwright/test'

// export * as Api from './lib/api'
// export * as Errors from './lib/errors'
// export * as Ogrs from './lib/ogrs'
// export * as Pdf from './lib/pdf'
// export * as San from './lib/san'
// export * as Sns from './lib/sns'
// export * as Task from './lib/task'
export { OasysDateTime } from './dateTime'


export const oasysLog: Log[] = []

export function log(logtext: string, type?: string) {

    oasysLog.push({ logText: logtext, type: type })
}
