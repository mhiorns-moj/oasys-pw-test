import * as oasys from 'lib'


export function minimal() {

    const page = new oasys.Pages.Assessment.Layer1Section2().goto(true)

    page.o2_2Weapon.setValue('No')
    page.o2_2Violence.setValue('No')
    page.o2_2ExcessiveViolence.setValue('No')
    page.o2_2Arson.setValue('No')
    page.impactRecognised.setValue('Yes')
}

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Assessment.Layer1Section2().goto(true)

    page.briefOffenceDetails.setValue(maxStrings ? oasys.oasysString(4000) : 'Brief offence details')
    page.o2_2Weapon.setValue('Yes')
    page.o2_2SpecifyWeapon.setValue(maxStrings ? oasys.oasysString(96) : 'A big weapon')
    page.o2_2Violence.setValue('Yes')
    page.o2_2ExcessiveViolence.setValue('Yes')
    page.o2_2Arson.setValue('Yes')
    page.o2_2PhysicalDamage.setValue('Yes')
    page.o2_2Sexual.setValue('Yes')
    page.o2_2DomesticAbuse.setValue('Yes')
    page.o2_3Direct.setValue(true)
    page.o2_3Hate.setValue(true)
    page.o2_3ResponseToVictim.setValue(true)
    page.o2_3PhysicalViolence.setValue(true)
    page.o2_3RepeatVictimisation.setValue(true)
    page.o2_3Strangers.setValue(true)
    page.o2_3Stalking.setValue(true)
    page.o2_4Relationship.setValue(maxStrings ? oasys.oasysString(4000) : 'Victim - perpetrator relationship')
    page.o2_4OtherInformation.setValue(maxStrings ? oasys.oasysString(4000) : 'Any other information of specific note, consider vulnerability')
    page.impactOnVictim.setValue(maxStrings ? oasys.oasysString(4000) : 'Impact on the victim')
    page.impactRecognised.setValue('Yes')

    oasys.Populate.CommonPages.Victims.victim1()
    oasys.Populate.CommonPages.Victims.victim2()
}
