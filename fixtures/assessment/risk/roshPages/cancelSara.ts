import * as oasys from 'lib'

export function cancelSara() {

    const page = new oasys.Pages.Sara.ReasonNoSara().goto(true)
    page.reason.setValue('There was no suitably trained assessor available')
    page.ok.click()
}