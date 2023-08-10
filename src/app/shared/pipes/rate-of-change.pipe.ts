import { Pipe, PipeTransform } from '@angular/core'

// 증감률 계산을 위한 파이프
@Pipe({
    name: 'rateOfChange',
})
export class RateOfChangePipe implements PipeTransform {
    transform(value: number, to: number, isSign = false): string {
        let returnValue = ''
        if (value - to > 0) {
            returnValue = to == 0 ? `100%` : `${Number(((value - to) / to) * 100).toFixed(2)}%`
            returnValue = isSign ? '+' + returnValue : returnValue
        } else if (value - to < 0) {
            returnValue = to == 0 ? `100%` : `${Number(((to - value) / to) * 100).toFixed(2)}%`
            returnValue = isSign ? '-' + returnValue : returnValue
        } else {
            returnValue = ''
        }
        return returnValue
    }
}
