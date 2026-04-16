

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.SentencePlan.RspSection1to2().goto(true)
    page.reviewNumber.setValue(1)
    page.reviewDate.setValue({})
    page.typeOfAssessment.setValue('Review')
}
