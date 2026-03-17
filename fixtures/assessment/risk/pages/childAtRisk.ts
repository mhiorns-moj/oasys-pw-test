import { OasysPage, Element } from 'classes'

export class ChildAtRisk extends OasysPage {

    name = 'ChildAtRisk'
    menu: Menu = { type: 'Subform', level1: 'Enter Child Details' }

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    childName = new Element.Textbox(this.page, '#P3_NAME_OF_CHILD')
    dateOfBirth = new Element.Textbox<OasysDate>(this.page, '#P3_DATE_OF_BIRTH', true)
    age = new Element.Select(this.page, '#P3_AGE_OF_CHILD_ELM')
    gender = new Element.Select(this.page, '#P3_GENDER_ELM')
    address = new Element.Textbox(this.page, '#P3_ADDRESS_OF_CHILD')
    relationship = new Element.Select(this.page, '#P3_REL_TO_INDIVIDUAL_ELM')
    relationshipOther = new Element.Textbox(this.page, '#P3_REL_TO_INDIVIDUAL_OTHER')
    contact = new Element.Select(this.page, '#P3_HAS_OR_SEEK_CONTACT')
    worried = new Element.Select(this.page, '#P3_WORRIED_ABOUT')
    worriedAbout = new Element.Textbox(this.page, '#P3_WORRIED_ABOUT_TEXT')
    knownToServices = new Element.Select(this.page, '#P3_EVER_KNOWN_CHILD_SERVICES')

    earlyHelpCurrent = new Element.Checkbox(this.page, '#P3_EARLY_HELP_0')
    earlyHelpPrevious = new Element.Checkbox(this.page, '#P3_EARLY_HELP_1')
    childInNeedCurrent = new Element.Checkbox(this.page, '#P3_CHILD_NEED_0')
    childInNeedPrevious = new Element.Checkbox(this.page, '#P3_CHILD_NEED_1')
    cppCurrent = new Element.Checkbox(this.page, '#P3_CHILD_PROT_PLAN_0')
    cppPrevious = new Element.Checkbox(this.page, '#P3_CHILD_PROT_PLAN_1')

    currentNeglect = new Element.Checkbox(this.page, '#itm2353C')
    currentPhysical = new Element.Checkbox(this.page, '#itm2354C')
    currentSexual = new Element.Checkbox(this.page, '#itm2355C')
    currentEmotional = new Element.Checkbox(this.page, '#itm2356C')
    previousNeglect = new Element.Checkbox(this.page, '#itm2353P')
    previousPhysical = new Element.Checkbox(this.page, '#itm2354P')
    previousSexual = new Element.Checkbox(this.page, '#itm2355P')
    previousEmotional = new Element.Checkbox(this.page, '#itm2356P')
    briefDetails = new Element.Textbox(this.page, '#P3_CATG_ABUSE_DETAILS')
    shareWithServices = new Element.Select(this.page, '#P3_SHARE_WITH_CHILD_SERVICES')
    recordRationale = new Element.Textbox(this.page, '#P3_SHARE_CHILD_SERV_DETAILS')

    delete = new Element.Button(this.page, 'Delete')
    addAnotherChild = new Element.Button(this.page, 'Add Another Child at Risk')
}
