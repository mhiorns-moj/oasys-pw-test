import * as oasys from 'lib'


export function noChanges() {

    const page = new oasys.Pages.Assessment.FastReview().goto(true)
    page.section2.setValue('No')
    page.section3.setValue('No')
    page.section4.setValue('No')
    page.section5.setValue('No')
    page.section6.setValue('No')
    page.section7.setValue('No')
    page.section8.setValue('No')
    page.section9.setValue('No')
    page.section10.setValue('No')
    page.section11.setValue('No')
    page.section12.setValue('No')
}
