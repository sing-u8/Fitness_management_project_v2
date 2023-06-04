import { ProductCode } from '@schemas/payment/product-code'

export type PaymentHistoryItem = {
    merchant_uid: string
    user_id: string
    center_id: string
    product_code: ProductCode
    sms_point: number
    start_date: string // YYYY-MM-DD
    end_date: string
    amount: number
    apply_num: string
    bank_code: string
    bank_name: string
    buyer_addr: string
    buyer_email: string
    buyer_name: string
    buyer_postcode: string
    buyer_tel: string
    cancel_amount: number
    cancel_reason: string
    cancelled_at: number
    card_code: string
    card_name: string
    card_number: string
    card_quota: number
    card_type: number
    cash_receipt_issued: boolean
    channel: string
    currency: string
    custom_data: string
    customer_uid: string
    customer_uid_usage: string
    emb_pg_provider: string
    escrow: boolean
    fail_reason: string
    failed_at: number
    imp_uid: string
    name: string
    paid_at: number
    pay_method: string
    pg_id: string
    pg_provider: string
    pg_tid: string
    receipt_url: string
    started_at: number
    status: 'paid' | 'cancelled'
    user_agent: string
    vbank_code: string
    vbank_date: number
    vbank_holder: string
    vbank_issued_at: number
    vbank_name: string
    vbank_num: string

    // 예약된 결제 내역 필드
    customer_id?: string
    schedule_at?: string
    executed_at?: string
    revoked_at?: string
    schedule_status?: 'scheduled' | 'executed' | 'revoked'
    payment_status?: string
    schedule_datetime?: string // YYYY-MM-DD HH:mm:ss
}
