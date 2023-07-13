import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { PadStartPipe } from './pad-start.pipe'
import { MinuteSecondsPipe } from './minute-seconds.pipe'
import { NumberWithCommasPipe } from './numberWithCommas.pipe'
import { AbsNumberPipe } from './abs-number.pipe'
import { RateOfChangePipe } from './rate-of-change.pipe'
import { DateFormatPipe } from './date-format.pipe'
import { PhoneNumberPipe } from './phone-number.pipe';
import { WordSlicePipe } from './word-slice.pipe'

@NgModule({
    declarations: [
        MinuteSecondsPipe,
        PadStartPipe,
        NumberWithCommasPipe,
        AbsNumberPipe,
        RateOfChangePipe,
        DateFormatPipe,
        PhoneNumberPipe,
        WordSlicePipe,
    ],
    imports: [CommonModule],
    exports: [
        MinuteSecondsPipe,
        PadStartPipe,
        NumberWithCommasPipe,
        AbsNumberPipe,
        RateOfChangePipe,
        DateFormatPipe,
        PhoneNumberPipe,
        WordSlicePipe
    ],
})
export class PipesModule {}
