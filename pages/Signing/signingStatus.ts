import { OasysPage, Element } from 'classes'

export class SigningStatus extends OasysPage {

    name = 'SigningStatus'

    mark1To9AsMissing = new Element.Button(this.page, 'Mark 1 to 9 as Missing')
    continueWithSigning = new Element.Button(this.page, 'Continue with Signing')
    returnToAssessment = new Element.Button(this.page, 'Return to Assessment')
    confirmSignAndLock = new Element.Button(this.page, 'Confirm Sign & Lock')
    noSaraReason = new Element.Select<'There was no suitably trained assessor available' | 'There are no indications within the current OASys that a SARA is required e.g. domestic abuse has occurred outside of Intimate Partner Abuse'>('#P3_SARA_REASON_ELM')

    cancel = new Element.Button(this.page, 'Cancel')
    header = new Element.Text(this.page, '.regionbuttonslefttop')
}
