import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { InputDirective } from './input.directive'
import { ButtonDirective } from '@shared/directives/button.directive'
import { TooltipDirective } from './tooltip.directive'

@NgModule({
    declarations: [InputDirective, ButtonDirective, TooltipDirective],
    imports: [CommonModule],
    exports: [InputDirective, ButtonDirective, TooltipDirective],
})
export class DirectivesModule {}
