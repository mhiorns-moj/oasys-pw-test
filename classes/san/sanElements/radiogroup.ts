export class Radiogroup<T extends string> {

    selector: string
    options: (T | '-')[]

    constructor(selector: string, options: (T | '-')[]) {

        this.selector = selector
        this.options = options
    }

    setValue(value: T) {

        if (value != null) {
            const itemNo = this.options.indexOf(value)
            const itemSuffix = itemNo == 0 ? '' : `-${itemNo + 1}`  // First item has no suffix on the id used to find it, remainder are -2, -3 etc
            cy.get(`${this.selector}${itemSuffix}`).click()
        }
    }
}
