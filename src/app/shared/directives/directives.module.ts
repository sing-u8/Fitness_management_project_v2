import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { InputDirective } from './input.directive'
import { ButtonDirective } from '@shared/directives/button.directive'

@NgModule({
    declarations: [InputDirective, ButtonDirective],
    imports: [CommonModule],
    exports: [InputDirective, ButtonDirective],
})
export class DirectivesModule {}
