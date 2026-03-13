import { userSuffix } from '../localSettings'

/**
 * The User class is used to define standard users for regression testing.
 * 
 */

export class User {

    username: string
    forename1: string
    surname: string
    lovLookup: string
    surnameForename: string
    forenameSurname: string
    profile?: { provider: string, frameworkRole: FrameworkRole, defaultCountersigner: User, roles: string[] }

    constructor(
        userDetails: { username: string, forename1?: string, surname?: string },
        profile?: { provider: string, frameworkRole: FrameworkRole, defaultCountersigner: User, roles: string[] }
    ) {
        this.username = `${userDetails.username}${userSuffix}`
        this.forename1 = userDetails.forename1
        this.surname = `${userDetails.surname}${userSuffix}`
        this.lovLookup = `[${this.username}]`
        this.surnameForename = `${this.surname} ${this.forename1}`
        this.forenameSurname = `${this.forename1} ${this.surname}`
        this.profile = profile
    }

}
