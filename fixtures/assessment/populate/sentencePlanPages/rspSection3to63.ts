import * as oasys from 'lib'
import * as AccreditedProgramme from './accreditedProgramme'


export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.SentencePlan.RspSection3to63().goto(true)
    page.capacityChanged.setValue('Yes')
    page.capacityChangedHow.setValue(maxStrings ? oasys.oasysString(4000) : 'How changed')
    page.discriminationWorkDone.setValue(maxStrings ? oasys.oasysString(4000) : 'Discrimination work done')
    page.discriminationWorkRequired.setValue(maxStrings ? oasys.oasysString(4000) : 'Discrimination work required')

    AccreditedProgramme.programme1()
    AccreditedProgramme.programme2()
}

