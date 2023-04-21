import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MinuteSecondsPipe } from './minute-seconds.pipe'
import { PadStartPipe } from './pad-start.pipe'

@NgModule({
    declarations: [MinuteSecondsPipe, PadStartPipe],
    imports: [CommonModule],
    exports: [MinuteSecondsPipe, PadStartPipe],
})
export class PipesModule {}
