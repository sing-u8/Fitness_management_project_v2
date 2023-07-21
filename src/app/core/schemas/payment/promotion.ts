import { SafeHtml } from '@angular/platform-browser'
import { Loading } from '@schemas/loading'
import { ProductCode } from '@schemas/payment/product-code'

export type DiscountUnitCode = 'promotion_discount_unit_percent' | 'promotion_discount_unit_won'

export type Promotion = {
    code: PromotionCode
    title: string
    description: string | SafeHtml
    start_datetime: string // YYYY-MM-DD HH:mm:ss
    end_datetime: string
    discount_unit_code: DiscountUnitCode
    discount: number

    // only for front end
    discount_price_for_percent?: number
    discount_price_for_money?: number
    isFriendPromotion?: boolean
    friend_event_valid?: boolean
    friend_event_loading?: Loading
    friend_event_error?: string
    friend_event_center_code?: string
}

export type PaymentPromotion = {
    code: string
    title: string
    description: string
    center_code: string
    count: number
    months: number
    discount_unit_code: string
    discount: number

    // used for frontend
    fe_title?: string
}

export type PromotionCode =
    | '1_years_launch_event_2023'
    | '1_years_friend_event'
    | '2_years_launch_event_2023'
    | '2_years_friend_event'
