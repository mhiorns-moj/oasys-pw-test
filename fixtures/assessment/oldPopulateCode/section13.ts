

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Assessment.Section13().goto(true)
    page.o13_1Details.setValue(maxStrings ? utils.oasysString(4000) : '13.1Details text')
}
