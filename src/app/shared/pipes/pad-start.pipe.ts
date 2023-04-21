import { Pipe, PipeTransform } from '@angular/core'
import _ from 'lodash'
@Pipe({
    name: 'padStart',
})
export class PadStartPipe implements PipeTransform {
    transform(value: number | string, length: number, pad: string): unknown {
        return _.padStart(String(value), length, pad)
    }
}
