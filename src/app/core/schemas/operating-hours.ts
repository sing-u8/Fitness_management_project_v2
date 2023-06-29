export interface OperatingHours {
    weekday: number // [0 ~ 6]
    day_off: boolean
    open_time: string
    close_time: string
}
