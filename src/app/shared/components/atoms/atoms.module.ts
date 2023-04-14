import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

// components

// libraries
import { NgxSpinnerModule } from 'ngx-spinner'
// comp
import {
    ButtonComponent,
    ButtonDoneContentDirective,
    ButtonIdleContentDirective,
    ButtonPendingContentDirective,
} from './button/button.component'
// svg
import { BallClipRotateComponent } from './svg/ball-clip-rotate/ball-clip-rotate.component'
import { CheckComponent } from './svg/check/check.component'

@NgModule({
    declarations: [
        // button
        ButtonComponent,
        ButtonIdleContentDirective,
        ButtonPendingContentDirective,
        ButtonDoneContentDirective,
        // svg
        BallClipRotateComponent,
        CheckComponent,
    ],
    imports: [NgxSpinnerModule, FormsModule, CommonModule],
    exports: [
        // button
        ButtonComponent,
        ButtonIdleContentDirective,
        ButtonPendingContentDirective,
        ButtonDoneContentDirective,
        BallClipRotateComponent,
        CheckComponent
        //
    ],
    schemas: [],
})
export class AtomsModule {}
