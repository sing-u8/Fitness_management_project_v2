import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { TooltipDirective } from './tooltip.directive'
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive'

@NgModule({
    declarations: [TooltipDirective, ClickOutsideDirective],
    imports: [CommonModule],
    exports: [TooltipDirective, ClickOutsideDirective],
})
export class DirectivesModule {}
