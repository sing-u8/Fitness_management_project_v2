export interface Registration {
    // 약관동의
    service_terms?: boolean
    privacy?: boolean
    marketing_sms?: boolean
    marketing_email?: boolean
    // 가입완료
    regCompleted?: boolean
    // 유저 정보
    name?: string
    email?: string
    emailValid?: boolean
    password?: string
    passwordValid?: boolean
    // for frontend
    linkedAccountExist?: boolean
}
