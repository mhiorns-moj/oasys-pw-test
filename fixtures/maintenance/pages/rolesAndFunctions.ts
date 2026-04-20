import { OasysPage, Element } from 'classes'

export class RolesAndFunctions extends OasysPage {

    name = 'RolesAndFunctions'
    title = 'Maintain Roles and Functions'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Roles and Functions' }

    role = new Element.Select(this.page, '#P7_REF_ROLE_CODE')
    createNewRole = new Element.Button(this.page, 'Create New Role')
    search = new Element.Button(this.page, 'Search')
    restrictedRole = new Element.Radiogroup(this.page, '#P7_RESTRICTED_IND')
    functionType = new Element.Select(this.page, '#P7_FUNCTION_TYPE')
    functionsShuttle = new Element.Shuttle(this.page, '#shuttleREF050_FUNCTIONS')
    providerTypesShuttle = new Element.Shuttle(this.page, '#shuttleREF050_PROVIDER_TYPES')
    close = new Element.Button(this.page, 'Close')
    save = new Element.Button(this.page, 'Save')
}
