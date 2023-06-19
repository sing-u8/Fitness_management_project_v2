import _ from 'lodash'
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export const emailReg = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
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
