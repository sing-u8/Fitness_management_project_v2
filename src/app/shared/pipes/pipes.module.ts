import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { PadStartPipe } from './pad-start.pipe'
import { MinuteSecondsPipe } from './minute-seconds.pipe'

@NgModule({
    declarations: [MinuteSecondsPipe, PadStartPipe],
    imports: [CommonModule],
    exports: [MinuteSecondsPipe, PadStartPipe],
})
export class PipesModule {}
