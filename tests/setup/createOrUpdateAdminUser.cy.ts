import { testEnvironment } from '../../localSettings'


const t2 = testEnvironment.name.includes('T2')

describe('Create or update admin user', () => {

    test('Create or update admin user', () => {

        // Check if user exists
        await oasysDb.selectCount(`select count(*) from eor.oasys_user where oasys_user_code = '${oasys.users.admin.username}'`, 'userCount')

        cy.get<number>('@userCount').then((userCount) => {
            let newUser = userCount == 0

            oasys.users.adminProfiles.forEach((profile) => {

                await oasys.login(oasys.Users.globalAdminUser, testEnvironment.globalAdminUserPassword, profile.provider)

                if (newUser) {
                    new oasys.Pages.Maintenance.UserAccounts().goto().createAccount.click()
                    const maintainUser = new oasys.Pages.Maintenance.MaintainUser()
                    maintainUser.userName.setValue(oasys.users.admin.username)
                    maintainUser.surname.setValue(oasys.users.admin.surname)
                    maintainUser.forename1.setValue(oasys.users.admin.forename1)
                    maintainUser.emailAddress.setValue(`${oasys.users.admin.username}@eor.${t2 ? 'localdomain' : 'local'}`)
                    maintainUser.save.click()
                    newUser = false
                } else {
                    // New account goes to profile automatically.  Open profile if editing existing user.
                    const userProfile = new oasys.Pages.Maintenance.UserProfile().goto()

                    userProfile.providerEstablishment.setValue('<All Provider / Establishments>')
                    userProfile.userName.setValue(oasys.users.admin.username)
                    userProfile.surname.setValue('')
                    userProfile.forename1.setValue('')
                    userProfile.search.click()
                    userProfile.userNameColumn.clickFirstRow()
                }

                const maintainProfile = new oasys.Pages.Maintenance.MaintainFullUserProfile()
                maintainProfile.forename1.setValue(oasys.users.admin.forename1)
                maintainProfile.surname.setValue(oasys.users.admin.surname)
                maintainProfile.lau.setValueByIndex(1)
                maintainProfile.mainTeam.setValueByIndex(1)
                if (profile.frameworkRole != null) {
                    maintainProfile.frameworkRole.setValue(profile.frameworkRole)
                }
                maintainProfile.defaultCountersigner.setValue(profile.defaultCountersigner?.lovLookup ?? '%')

                maintainProfile.roles.clickButton('removeall')
                maintainProfile.roles.addItems(profile.roles)

                maintainProfile.save.click()
                maintainProfile.close.click()

                await oasys.logout()
            })

            if (!t2) {
                await oasysDb.setPassword(oasys.users.admin.username, testEnvironment.standardUserPassword)
            }
        })
    })
})
