export interface StatsSales {
    date: string
    type_code: 'payment_type_refund' | 'payment_type_payment' | 'payment_type_transfer'
    type_code_name: string
    center_user_name: string
    center_user_phone_number: string
    product_type_code: string
    product_type_code_name: string
    product_name: string
    responsibility_center_user_name: string
    responsibility_center_user_phone_number: string
    card: number
    cash: number
    trans: number
    unpaid: number
}

export interface GetStatsSalesReturnSummary {
    rows: number
    payment_count: number
    refund_count: number
    sum_card: number
    sum_trans: number
    sum_cash: number
    sum_unpaid: number
}
export interface GetStatsSalesReturn {
    summary: GetStatsSalesReturnSummary
    dataset: Array<StatsSales>
}
