import { Center } from './center'
import { CenterUser } from '@schemas/center-user'

export interface User {
    id: string
    name: string
    sex: string
    birth_date: string
    email: string
    email_verified: boolean
    phone_number: string
    phone_number_verified: boolean
    color: string
    privacy: boolean
    service_terms: boolean
    marketing_sms: boolean
    marketing_email: boolean
    push_notification: boolean
    providers: string //  example: google.com, apple.com, kakao.com, redwhale.xyz
    picture: string
    background: string
    access_token: string
    refresh_token: string
    custom_token: string

    // default information
    // id: string
    // provider: string
    // membership_number: string
    // name: string
    // sex: string
    // birth_date: string
    // email: string
    // email_verified: boolean
    // phone_number: string
    // phone_number_verified: boolean
    // color: string

    // terms
    // privacy: boolean
    // service_terms: boolean
    // marketing_sms: boolean
    // marketing_email: boolean
    // push_notification: boolean

    // etc
    // picture: string
    // background: string
    // last_logged_at: string
    // access_token: string
    // refresh_token: string
    // custom_token: string

    // -- / frontend props
    selected_center?: Center
    selected_center_user?: CenterUser
    sign_in_method?: string
    sawVerificationPhoneOnce?: boolean
    fcm_token: string
}
