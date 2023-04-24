import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { InputDirective } from './input.directive'
import { ButtonDirective } from '@shared/directives/button.directive'
import { TooltipDirective } from './tooltip.directive'
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive'

@NgModule({
    declarations: [InputDirective, ButtonDirective, TooltipDirective, ClickOutsideDirective],
    imports: [CommonModule],
    exports: [InputDirective, ButtonDirective, TooltipDirective, ClickOutsideDirective],
})
export class DirectivesModule {}
