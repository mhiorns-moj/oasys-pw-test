import { OasysPage, Element } from 'classes'

export class CreateSara extends OasysPage {

    name = 'CreateSARA'

    create = new Element.Button(this.page, 'Create')
    cancel = new Element.Button(this.page, 'Cancel')
    yes = new Element.Button(this.page, 'Yes')
    no = new Element.Button(this.page, 'No')
}
