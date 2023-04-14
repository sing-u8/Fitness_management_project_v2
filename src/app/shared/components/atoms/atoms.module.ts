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
import {
    GhostButtonComponent,
    GhostButtonDoneContentDirective,
    GhostButtonPendingContentDirective,
    GhostButtonIdleContentDirective,
} from './ghost-button/ghost-button.component'
// svg
import { BallClipRotateComponent } from './svg/ball-clip-rotate/ball-clip-rotate.component'
import { CheckComponent } from './svg/check/check.component';
import { PlusComponent } from './svg/plus/plus.component'

@NgModule({
    declarations: [
        // button
        ButtonComponent,
        ButtonIdleContentDirective,
        ButtonPendingContentDirective,
        ButtonDoneContentDirective,
        GhostButtonComponent,
        GhostButtonDoneContentDirective,
        GhostButtonPendingContentDirective,
        GhostButtonIdleContentDirective,
        // svg
        BallClipRotateComponent,
        CheckComponent,
        PlusComponent,
    ],
    imports: [NgxSpinnerModule, FormsModule, CommonModule],
    exports: [
        // button
        ButtonComponent,
        ButtonIdleContentDirective,
        ButtonPendingContentDirective,
        ButtonDoneContentDirective,
        GhostButtonComponent,
        GhostButtonDoneContentDirective,
        GhostButtonPendingContentDirective,
        GhostButtonIdleContentDirective,
        //
        BallClipRotateComponent,
        CheckComponent,
        PlusComponent
    ],
    schemas: [],
})
export class AtomsModule {}
