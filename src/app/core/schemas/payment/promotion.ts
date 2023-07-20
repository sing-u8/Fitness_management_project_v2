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
    activation: boolean
    center_code: string
    center_id: string
    code: string
    count: number
    created_at: string // '2023-07-18 03:19:07' YYYY-MM-DD HH:mm:ss
    description: string
    discount: number
    discount_unit_code: DiscountUnitCode
    end_datetime: string // YYYY-MM-DD HH:mm:ss
    id: string
    merchant_uid: string
    months: number
    product_code: ProductCode
    promotion_code: string
    select_yn: boolean
    sequence_number: number
    start_datetime: string // YYYY-MM-DD HH:mm:ss
    title: string
    user_id: string
    // used for frontend
    fe_title?: string
}

export type PromotionCode =
    | '1_years_launch_event_2023'
    | '1_years_friend_event'
    | '2_years_launch_event_2023'
    | '2_years_friend_event'
