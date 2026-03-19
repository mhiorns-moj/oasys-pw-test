export const script: SanScript = {
    section: 'Accommodation',
    scenarios: [
        {
            name: '1 - No accommodation',
            steps: [
                { item: 'currentAccommodation', value: `noAccommodation` },
                { item: 'noAccommodationType', value: `campsite` },
                { item: 'saveAndContinue' },
            ],
            oasysAnswers: [
                { section: '3', q: '3.3', a: `YES` },
                { section: '3', q: '3.4', a: `2` },
                { section: '3', q: '3.5', a: `2` },
                { section: '3', q: '3.6', a: `2` },
                { section: '6', q: '6.8', a: '3' },
                { section: '3', q: '3.97', a: null },
                { section: '3', q: '3.98', a: null },
                { section: '3', q: '3.99', a: null },
                { section: '3', q: '3_SAN_STRENGTH', a: null },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `NO` },
            ],
        },
        {
            name: '2 - Settled',
            steps: [
                { item: 'back' },
                { item: 'currentAccommodation', value: `settled` },
                { item: 'settledAccommodationType', value: `friends` },
                { item: 'saveAndContinue' },
            ],
            oasysAnswers: [
                { section: '3', q: '3.3', a: `NO` },
                { section: '3', q: '3.4', a: null },
                { section: '3', q: '3.5', a: `0` },
                { section: '3', q: '3.6', a: null },
                { section: '6', q: '6.8', a: '3' },
                { section: '3', q: '3.97', a: null },
                { section: '3', q: '3.98', a: null },
                { section: '3', q: '3.99', a: null },
                { section: '3', q: '3_SAN_STRENGTH', a: null },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `NO` },
            ],
        },
        {
            name: '3 - Temporary',
            steps: [
                { item: 'back' },
                { item: 'currentAccommodation', value: `temporary` },
                { item: 'temporaryAccommodationType', value: `cas2` },
                { item: 'saveAndContinue' },
            ],
            oasysAnswers: [
                { section: '3', q: '3.3', a: `NO` },
                { section: '3', q: '3.4', a: null },
                { section: '3', q: '3.5', a: null },
                { section: '3', q: '3.6', a: null },
                { section: '6', q: '6.8', a: '3' },
                { section: '3', q: '3.97', a: null },
                { section: '3', q: '3.98', a: null },
                { section: '3', q: '3.99', a: null },
                { section: '3', q: '3_SAN_STRENGTH', a: null },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `NO` },
            ],
        },
        {
            name: '4 - Suitable',
            steps: [
                { item: 'back' },
                { item: 'currentAccommodation', value: `settled` },
                { item: 'settledAccommodationType', value: `friends` },
                { item: 'saveAndContinue' },
                { item: 'livingWith', value: `family, partner` },
                { item: 'locationSuitable', value: `yes` },
                { item: 'accommodationSuitable', value: `yes` },
                { item: 'wantChangesAccommodation', value: `madeChanges` },
                { item: 'saveAndContinue' },
            ],
            oasysAnswers: [
                { section: '3', q: '3.3', a: `NO` },
                { section: '3', q: '3.4', a: `0` },
                { section: '3', q: '3.5', a: `0` },
                { section: '3', q: '3.6', a: `0` },
                { section: '6', q: '6.8', a: `1` },
                { section: '3', q: '3.97', a: null },
                { section: '3', q: '3.98', a: null },
                { section: '3', q: '3.99', a: null },
                { section: '3', q: '3_SAN_STRENGTH', a: null },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `NO` },
            ],
        },
        {
            name: '5 - Suitable with concerns',
            steps: [
                { item: 'change' },
                { item: 'currentAccommodation', value: `settled` },
                { item: 'settledAccommodationType', value: `privateRenting` },
                { item: 'saveAndContinue' },
                { item: 'livingWith', value: `partner, child` },
                { item: 'locationSuitable', value: `no` },
                { item: 'accommodationSuitable', value: `yesWithConcerns` },
                { item: 'wantChangesAccommodation', value: `notApplicable` },
                { item: 'saveAndContinue' },
            ],
            oasysAnswers: [
                { section: '3', q: '3.3', a: `NO` },
                { section: '3', q: '3.4', a: `1` },
                { section: '3', q: '3.5', a: `0` },
                { section: '3', q: '3.6', a: `2` },
                { section: '6', q: '6.8', a: `1` },
                { section: '3', q: '3.97', a: null },
                { section: '3', q: '3.98', a: null },
                { section: '3', q: '3.99', a: null },
                { section: '3', q: '3_SAN_STRENGTH', a: null },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `NO` },
            ],
        },
        {
            name: '6 - Short term, not suitable',
            steps: [
                { item: 'change' },
                { item: 'currentAccommodation', value: `temporary` },
                { item: 'temporaryAccommodationType', value: `shortTerm` },
                { item: 'saveAndContinue' },
                { item: 'livingWith', value: `partner, other` },
                { item: 'futurePlanned', value: `no` },
                { item: 'locationSuitable', value: `yes` },
                { item: 'accommodationSuitable', value: `no` },
                { item: 'wantChangesAccommodation', value: `notAnswering` },
                { item: 'saveAndContinue' },
            ],
            oasysAnswers: [
                { section: '3', q: '3.3', a: `NO` },
                { section: '3', q: '3.4', a: `2` },
                { section: '3', q: '3.5', a: `2` },
                { section: '3', q: '3.6', a: `0` },
                { section: '6', q: '6.8', a: `1` },
                { section: '3', q: '3.97', a: null },
                { section: '3', q: '3.98', a: null },
                { section: '3', q: '3.99', a: null },
                { section: '3', q: '3_SAN_STRENGTH', a: null },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `NO` },
            ],
        },
        {
            name: '7 - Location suitable',
            steps: [
                { item: 'change' },
                { item: 'currentAccommodation', value: `temporary` },
                { item: 'temporaryAccommodationType', value: `immigration` },
                { item: 'saveAndContinue' },
                { item: 'livingWith', value: `family` },
                { item: 'futurePlanned', value: `no` },
                { item: 'locationSuitable', value: `yes` },
                { item: 'accommodationSuitable', value: `yesWithConcerns` },
                { item: 'wantChangesAccommodation', value: `notWanted` },
                { item: 'saveAndContinue' },
            ],
            oasysAnswers: [
                { section: '3', q: '3.3', a: `NO` },
                { section: '3', q: '3.4', a: `1` },
                { section: '3', q: '3.5', a: null },
                { section: '3', q: '3.6', a: `0` },
                { section: '6', q: '6.8', a: '3' },
                { section: '3', q: '3.97', a: null },
                { section: '3', q: '3.98', a: null },
                { section: '3', q: '3.99', a: null },
                { section: '3', q: '3_SAN_STRENGTH', a: null },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `NO` },
            ],
        },
        {
            name: '8 - Location not suitable',
            steps: [
                { item: 'change' },
                { item: 'currentAccommodation', value: `settled` },
                { item: 'settledAccommodationType', value: `friends` },
                { item: 'saveAndContinue' },
                { item: 'livingWith', value: `family, friends, other` },
                { item: 'locationSuitable', value: `no` },
                { item: 'accommodationSuitable', value: `no` },
                { item: 'wantChangesAccommodation', value: `thinking` },
                { item: 'saveAndContinue' },
            ],
            oasysAnswers: [
                { section: '3', q: '3.3', a: `NO` },
                { section: '3', q: '3.4', a: `2` },
                { section: '3', q: '3.5', a: `0` },
                { section: '3', q: '3.6', a: `2` },
                { section: '6', q: '6.8', a: '3' },
                { section: '3', q: '3.97', a: null },
                { section: '3', q: '3.98', a: null },
                { section: '3', q: '3.99', a: null },
                { section: '3', q: '3_SAN_STRENGTH', a: null },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `NO` },
            ],
        },
        {
            name: 'A1 - Strength',
            steps: [
                { item: 'change' },
                { item: 'saveAndContinue' },
                { item: 'saveAndContinue' },
                { item: 'practitionerAnalysis' },
                { item: 'accommodationStrengths', value: `yes` },
                { item: 'accommodationStrengthsYesDetails', value: `There are some strengths` },
                { item: 'accommodationRiskSeriousHarm', value: `no` },
                { item: 'accommodationRiskSeriousHarmNoDetails', value: `No risk of serious harm` },
                { item: 'accommodationRiskReoffending', value: `no` },
                { item: 'accommodationRiskReoffendingNoDetails', value: `No risk of reoffending` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                {
                    section: '3', q: '3.97', a: `Strengths and protective factor notes - There are some strengths
Area not linked to serious harm notes - No risk of serious harm
Area not linked to reoffending notes - No risk of reoffending` },
                { section: '3', q: '3.98', a: `NO` },
                { section: '3', q: '3.99', a: `NO` },
                { section: '3', q: '3_SAN_STRENGTH', a: `YES` },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A2 - Risk of harm',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'changeAnalysis' },
                { item: 'accommodationStrengths', value: `no` },
                { item: 'accommodationStrengthsNoDetails', value: `There are no strengths` },
                { item: 'accommodationRiskSeriousHarm', value: `yes` },
                { item: 'accommodationRiskSeriousHarmYesDetails', value: `There is a risk of serious harm` },
                { item: 'accommodationRiskReoffending', value: `no` },
                { item: 'accommodationRiskReoffendingNoDetails', value: `No risk of reoffending` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                {
                    section: '3', q: '3.97', a: `Area not linked to strengths and positive factors notes - There are no strengths
Area linked to serious harm notes - There is a risk of serious harm
Area not linked to reoffending notes - No risk of reoffending` },
                { section: '3', q: '3.98', a: `YES` },
                { section: '3', q: '3.99', a: `NO` },
                { section: '3', q: '3_SAN_STRENGTH', a: `NO` },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A3 - Risk of reoffending',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'changeAnalysis' },
                { item: 'accommodationStrengths', value: `no` },
                { item: 'accommodationStrengthsNoDetails', value: `There are no strengths` },
                { item: 'accommodationRiskSeriousHarm', value: `no` },
                { item: 'accommodationRiskSeriousHarmNoDetails', value: `No risk of serious harm` },
                { item: 'accommodationRiskReoffending', value: `yes` },
                { item: 'accommodationRiskReoffendingYesDetails', value: `High risk of reoffending` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                {
                    section: '3', q: '3.97', a: `Area not linked to strengths and positive factors notes - There are no strengths
Area not linked to serious harm notes - No risk of serious harm
Risk of reoffending notes - High risk of reoffending` },
                { section: '3', q: '3.98', a: `NO` },
                { section: '3', q: '3.99', a: `YES` },
                { section: '3', q: '3_SAN_STRENGTH', a: `NO` },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A4 - None',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'changeAnalysis' },
                { item: 'accommodationStrengths', value: `no` },
                { item: 'accommodationStrengthsNoDetails', value: `There are no strengths` },
                { item: 'accommodationRiskSeriousHarm', value: `no` },
                { item: 'accommodationRiskSeriousHarmNoDetails', value: `No risk of serious harm` },
                { item: 'accommodationRiskReoffending', value: `no` },
                { item: 'accommodationRiskReoffendingNoDetails', value: `No risk of reoffending;` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                {
                    section: '3', q: '3.97', a: `Area not linked to strengths and positive factors notes - There are no strengths
Area not linked to serious harm notes - No risk of serious harm
Area not linked to reoffending notes - No risk of reoffending;` },
                { section: '3', q: '3.98', a: `NO` },
                { section: '3', q: '3.99', a: `NO` },
                { section: '3', q: '3_SAN_STRENGTH', a: `NO` },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A5 - All, max length',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'changeAnalysis' },
                { item: 'accommodationStrengths', value: `yes` },
                {
                    item: 'accommodationStrengthsYesDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABC` },
                { item: 'accommodationRiskSeriousHarm', value: `yes` },
                {
                    item: 'accommodationRiskSeriousHarmYesDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABC` },
                { item: 'accommodationRiskReoffending', value: `yes` },
                {
                    item: 'accommodationRiskReoffendingYesDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                {
                    section: '3', q: '3.97', a: `Strengths and protective factor notes - ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABC
Area linked to serious harm notes - ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABC
Risk of reoffending notes - ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { section: '3', q: '3.98', a: `YES` },
                { section: '3', q: '3.99', a: `YES` },
                { section: '3', q: '3_SAN_STRENGTH', a: `YES` },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A6 - No, empty strings',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'changeAnalysis' },
                { item: 'accommodationStrengths', value: `no` },
                { item: 'accommodationStrengthsNoDetails', value: `` },
                { item: 'accommodationRiskSeriousHarm', value: `no` },
                { item: 'accommodationRiskSeriousHarmNoDetails', value: `` },
                { item: 'accommodationRiskReoffending', value: `no` },
                { item: 'accommodationRiskReoffendingNoDetails', value: `` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '3', q: '3.97', a: null },
                { section: '3', q: '3.98', a: `NO` },
                { section: '3', q: '3.99', a: `NO` },
                { section: '3', q: '3_SAN_STRENGTH', a: `NO` },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A7 - No, empty strings',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'changeAnalysis' },
                { item: 'accommodationStrengths', value: `no` },
                { item: 'accommodationStrengthsNoDetails', value: `` },
                { item: 'accommodationRiskSeriousHarm', value: `no` },
                { item: 'accommodationRiskSeriousHarmNoDetails', value: `Nothing to report` },
                { item: 'accommodationRiskReoffending', value: `no` },
                { item: 'accommodationRiskReoffendingNoDetails', value: `Nothing to report:` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                {
                    section: '3', q: '3.97', a: `Area not linked to serious harm notes - Nothing to report
Area not linked to reoffending notes - Nothing to report:` },
                { section: '3', q: '3.98', a: `NO` },
                { section: '3', q: '3.99', a: `NO` },
                { section: '3', q: '3_SAN_STRENGTH', a: `NO` },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A8 - No, empty strings',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'changeAnalysis' },
                { item: 'accommodationStrengths', value: `no` },
                { item: 'accommodationStrengthsNoDetails', value: `Nothing to report` },
                { item: 'accommodationRiskSeriousHarm', value: `no` },
                { item: 'accommodationRiskSeriousHarmNoDetails', value: `` },
                { item: 'accommodationRiskReoffending', value: `no` },
                { item: 'accommodationRiskReoffendingNoDetails', value: `Nothing to report` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                {
                    section: '3', q: '3.97', a: `Area not linked to strengths and positive factors notes - Nothing to report
Area not linked to reoffending notes - Nothing to report` },
                { section: '3', q: '3.98', a: `NO` },
                { section: '3', q: '3.99', a: `NO` },
                { section: '3', q: '3_SAN_STRENGTH', a: `NO` },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A9 - No, empty strings',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'changeAnalysis' },
                { item: 'accommodationStrengths', value: `no` },
                { item: 'accommodationStrengthsNoDetails', value: `Nothing to report#` },
                { item: 'accommodationRiskSeriousHarm', value: `no` },
                { item: 'accommodationRiskSeriousHarmNoDetails', value: `Nothing to report` },
                { item: 'accommodationRiskReoffending', value: `no` },
                { item: 'accommodationRiskReoffendingNoDetails', value: `` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                {
                    section: '3', q: '3.97', a: `Area not linked to strengths and positive factors notes - Nothing to report#
Area not linked to serious harm notes - Nothing to report` },
                { section: '3', q: '3.98', a: `NO` },
                { section: '3', q: '3.99', a: `NO` },
                { section: '3', q: '3_SAN_STRENGTH', a: `NO` },
                { section: 'SAN', q: 'AC_SAN_SECTION_COMP', a: `YES` },
            ],
        },
    ]
}

