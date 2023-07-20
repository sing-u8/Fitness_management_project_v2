import { BasePaymentItem } from './base-payment-item'

export interface ScheduleResult extends BasePaymentItem {
    // merchant_uid: string
    // product_code: string
    // product_price: number
    // start_date: string
    // end_date: string
    // currency: string
    // amount: number
    // card_name: string
    // card_number: string

    schedule_at: string
}
