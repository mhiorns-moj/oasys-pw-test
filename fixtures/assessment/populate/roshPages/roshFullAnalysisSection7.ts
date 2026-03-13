import * as oasys from 'lib'
import * as childAtRisk from './childAtRisk'

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Rosh.RoshFullAnalysisSection7().goto(true)
    childAtRisk.fullyPopulatedChild1(maxStrings)
    childAtRisk.fullyPopulatedChild2(maxStrings)
}
