import { OgrsOffenceCat } from '../types'

export const offenceCats: { [keys: string]: OgrsOffenceCat } = {

    'Absconding/bail': { cat: 'absconding_bail', addVatpFlag: false },
    'Acquisitive violence': { cat: 'robbery', addVatpFlag: false },
    'Burglary (domestic)': { cat: 'burglary_domestic', addVatpFlag: false },
    'Burglary (other)': { cat: 'burglary_non_domestic', addVatpFlag: false },
    'Criminal damage': { cat: 'criminal_damage', addVatpFlag: false },
    'Drink driving': { cat: 'drink_driving', addVatpFlag: false },
    'Drug import/export/production': { cat: 'drug_import_export_production', addVatpFlag: false },
    'Drug possession/supply': { cat: 'drug_possesion_supply', addVatpFlag: false },
    'Drunkenness': { cat: 'drunkenness', addVatpFlag: false },
    'Firearms (most serious)': { cat: 'index_firearms', addVatpFlag: true },
    'Firearms (other)': { cat: 'index_farmers_shotgun', addVatpFlag: true },
    'Fraud and forgery': { cat: 'fraud_forgery', addVatpFlag: false },
    'Handling stolen goods': { cat: 'handling_stolen_goods', addVatpFlag: false },
    'Motoring offences': { cat: 'motoring_other_than_drink', addVatpFlag: false },
    'Other offences': { cat: 'other_offences', addVatpFlag: false },
    'Public order and harassment': { cat: 'public_order_harassment', addVatpFlag: false },
    'Sexual (against child)': { cat: 'sexual_offences_children', addVatpFlag: false },
    'Sexual (not against child)': { cat: 'sexual_offences_not_children', addVatpFlag: false },
    'Theft (non-motor)': { cat: 'theft_handling_not_vehicle', addVatpFlag: false },
    'Vehicle-related theft': { cat: 'vehicle_related_theft', addVatpFlag: false },
    'Violence against the person (ABH+)': { cat: 'index_abh_or_above', addVatpFlag: true },
    'Violence against the person (sub-ABH)': { cat: 'vatp_flag', addVatpFlag: false },
    'Weapons (non-firearm)': { cat: 'index_weapons_not_firearm', addVatpFlag: true },
    'Welfare fraud': { cat: 'welfare_fraud', addVatpFlag: false },
}
