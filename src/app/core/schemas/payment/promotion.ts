import { SafeHtml } from '@angular/platform-browser'

export type Promotion = {
    code: PromotionCode
    title: string
    description: string | SafeHtml
    start: string // YYYY-MM-DD HH:mm:ss
    end: string
    discount_unit_code: 'promotion_discount_unit_percent' | 'promotion_discount_unit_won'
    discount: number
    // only for front end
    discount_price_for_percent?: number
    discount_price_for_money?: number
    isFriendPromotion?: boolean
    friend_event_valid?: boolean
    friend_event_error?: string
    friend_event_center_url?: string
}

export type PromotionCode =
    | '1_years_launch_event_2023'
    | '1_years_friend_event_2023'
    | '2_years_launch_event_2023'
    | '2_years_friend_event_2023'
    | 'lifetime_launch_event_2023'
    | 'lifetime_friend_event_2023'
