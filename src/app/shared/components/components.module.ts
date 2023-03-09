import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

// ngx libraries
import { NgxGaugeModule } from 'ngx-gauge'
import { NgxSpinnerModule } from 'ngx-spinner'
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

import { ButtonComponent } from './button/button.component'
import { RadioButtonComponent } from './radio-button/radio-button.component'
import { CheckboxComponent } from './checkbox/checkbox.component'
import { ToastComponent } from './toast/toast.component'
import { ModalComponent } from './modal/modal.component'

@NgModule({
    declarations: [ButtonComponent, RadioButtonComponent, CheckboxComponent, ToastComponent, ModalComponent],
    imports: [NgxGaugeModule, NgxSpinnerModule, NgxSkeletonLoaderModule, FormsModule, CommonModule],
    exports: [
        ButtonComponent,
        RadioButtonComponent,
        CheckboxComponent,
        ToastComponent,
        ModalComponent,
        NgxSpinnerModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedComponentsModule {}
