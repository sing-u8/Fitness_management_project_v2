import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'wordSlice',
})
export class WordSlicePipe implements PipeTransform {
    transform(value: string, start: number, end?: number): string {
        if (end) {
            return value.slice(start, end)
        } else {
            return value.slice(start)
        }
    }
}
