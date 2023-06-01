import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { TooltipDirective } from './tooltip.directive'
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive'
import { EllipsisDropdownDirective } from './ellipsis-dropdown.directive'

@NgModule({
    declarations: [TooltipDirective, ClickOutsideDirective, EllipsisDropdownDirective],
    imports: [CommonModule],
    exports: [TooltipDirective, ClickOutsideDirective, EllipsisDropdownDirective],
})
export class DirectivesModule {}
