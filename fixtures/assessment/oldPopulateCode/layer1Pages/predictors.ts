
export function minimal() {

    const page = new oasys.Pages.Assessment.Predictors().goto(true)

    page.dateFirstSanction.setValue({ years: -2 })
    page.o1_32.setValue(2)
}