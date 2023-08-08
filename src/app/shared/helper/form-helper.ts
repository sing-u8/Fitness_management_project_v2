import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'
import _ from 'lodash'
import dayjs from 'dayjs'

export const emailReg = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
export const phoneNumberRegObj = {
    with_dash: /^\d{2,3}-?\d{3,4}-?\d{4}$/,
    without_dash: /^(\d{2,3})(\d{3,4})(\d{4})$/,
    f4_with_dash: /^(\d{4})-?(\d{3,4})-?(\d{4})$/,
    f4_without_dash: /^(\d{4})(\d{3,4})(\d{4})$/,
}
export function isEmail(email: string, regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/): boolean {
    return regex.test(email)
}
export function isPassword(
    password: string,
    pwLenArr: [number, number] = [8, 15],
    regexArr: Array<RegExp> = [/[0-9]/, /[a-zA-Z]/, /[~!@#$%^&*()_+|<>?:{}]/, /^\S*$/]
) {
    return (
        _.every(regexArr, (pattern) => {
            return pattern.test(password)
        }) &&
        pwLenArr[0] <= password.length &&
        pwLenArr[1] >= password.length
    )
}

export const shortBirthDateReg = [
    /^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/,
    /^\d{2}-(0[1-9]|1[0-2])-([0-2][1-9]|3[01])$/,
]
export const longBirthDateReg = [
    /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/,
    /^(19|20)\d{2}-(0[1-9]|1[0-2])-([0-2][1-9]|3[01])$/,
]

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!isPassword(control.value)) {
            return {
                notValid: true,
            }
        }
        return null
    }
}

export function changeUserBirthDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const strVal = String(control.value)
        if (
            shortBirthDateReg[0].test(control.value) &&
            (strVal == dayjs('19' + strVal).format('YYMMDD') || strVal == dayjs('20' + strVal).format('YYMMDD'))
        ) {
            return null
        } else {
            return {
                invalid_date_of_birth: true,
            }
        }
    }
}
