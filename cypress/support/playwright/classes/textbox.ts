import { Page } from '@playwright/test'
import { OasysDateTime } from 'oasys'

export class Textbox<T> {

    selector: string
    browserPage: Page

    constructor(selector: string, browserPage: Page) {

        this.selector = selector
        this.browserPage = browserPage
    }

    async setValue(value: T) {

        let textValue = value as string
        if (value == null) {
            textValue = ''
        } else if (typeof value == 'number') {
            textValue = value == 0 ? '0' : value.toString()
        } else if (typeof value != 'string') {
            textValue = OasysDateTime.oasysDateAsString(value as OasysDate)
        }
        await this.browserPage.locator(this.selector).fill(textValue)
    }

    //     checkValue(value: T, partial: boolean = false) {

    //         let textValue = value as string
    //         if (value == null) {
    //             textValue = ''
    //         } else if (typeof value == 'number') {
    //             textValue = value == 0 ? '0' : value.toString()
    //         } else if (typeof value != 'string') {
    //             textValue = OasysDateTime.oasysDateAsString(value as OasysDate)
    //         }
    //         this.getStatusAndValue('result')
    //         cy.get<ElementStatusAndValue>('@result').then((result) => {
    //             if ((textValue != result.value && !partial) || ((!result.value.includes(textValue) && partial))) {
    //                 throw new Error(`Incorrect value for ${this.selector}: expected ${textValue}, found ${result.value}`)
    //             }
    //         })
    //     }

    //     getValue(alias: string) {

    //         cy.get(this.selector).invoke('val').as(alias)
    //     }

    //     checkStatus(status: ElementStatus) {

    //         this.getStatusAndValue('result')
    //         cy.get<ElementStatusAndValue>('@result').then((result) => {
    //             if (status != result.status) {
    //                 throw new Error(`Incorrect status for ${this.selector}: expected ${status}, found ${result.status}`)
    //             }
    //         })
    //     }

    //     checkLabel(label: string) {

    //         cy.get(this.selector).parent().parent().parent().find('label').then((labelElement) => {
    //             const actualLabel = labelElement[0].textContent
    //             if (actualLabel != label) {
    //                 throw new Error(`Incorrect label for ${this.selector}: expected '${label}', found '${actualLabel}'`)
    //             }
    //         })
    //     }

    //     /**
    //      * Gets the current status and value of a text element, assumes it exists
    //      * Parameter is a Cypress alias which can then be used to access the return value.
    //      * The return value is an ElementStatusAndValue object, containing status and value properties.
    //      */
    //     getStatusAndValue(alias: string) {

    //         let result: ElementStatusAndValue = { status: 'notVisible', value: '' }

    //         cy.get('#content').then((containerDiv) => {

    //             let element = containerDiv.find(this.selector)

    //             if (element.length > 0) { // If element exists in the DOM

    //                 if (element.is(':visible')) {

    //                     result.status = 'enabled'

    //                     this.getValue('val')
    //                     cy.get('@val').then((val) => result.value = val.toString())

    //                     if (!element.is(':enabled')) {
    //                         result.status = 'readonly'
    //                     } else {
    //                         cy.get(this.selector).invoke('attr', 'input_readonly').then((res) => {
    //                             if (res == 'true') {
    //                                 result.status = 'readonly'
    //                             }
    //                         })
    //                         cy.get(this.selector).invoke('attr', 'readonly').then((res) => {
    //                             if (res == 'readonly') {
    //                                 result.status = 'readonly'
    //                             }
    //                         })
    //                         cy.get(this.selector).invoke('attr', 'data-mimic_readonly').then((res) => {
    //                             if (res == 'true') {
    //                                 result.status = 'readonly'
    //                             }
    //                         })
    //                     }
    //                 }
    //             }

    //         })
    //         cy.wrap(result).as(alias)
    //     }

    // }
}