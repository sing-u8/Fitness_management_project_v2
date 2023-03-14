import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SharedModule } from '@shared/shared.module'

// components
import { AuthHeaderComponent } from './auth-header/auth-header.component'

@NgModule({
    declarations: [AuthHeaderComponent],
    imports: [CommonModule, SharedModule],
    exports: [AuthHeaderComponent],
})
export class ComponentsModule {}
