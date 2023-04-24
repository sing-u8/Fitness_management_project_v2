import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

// modules
import { DirectivesModule } from '@shared/directives/directives.module'
import { PipesModule } from '@shared/pipes/pipes.module'

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
import { IconButtonComponent } from './icon-button/icon-button.component'
import { IconGhostButtonComponent } from './icon-ghost-button/icon-ghost-button.component'
import { CheckboxComponent } from './checkbox/checkbox.component'
// svg
import { BallClipRotateComponent } from './svg/ball-clip-rotate/ball-clip-rotate.component'
import { CheckComponent } from './svg/check/check.component'
import { PlusComponent } from './svg/plus/plus.component'
import { TextButtonComponent } from './text-button/text-button.component'
import { UserListComponent } from './svg/user-list/user-list.component'
import { PencilComponent } from './svg/pencil/pencil.component'
import { GearComponent } from './svg/gear/gear.component'
import { DotsThreeComponent } from './svg/dots-three/dots-three.component'
import { RadioButtonComponent } from './radio-button/radio-button.component'
import { ToggleButtonComponent } from './toggle-button/toggle-button.component'
import { TabComponent } from './tab/tab.component'
import { TabSmComponent } from './tab-sm/tab-sm.component'
import { PageButtonComponent } from './page-button/page-button.component'
import { TextFieldComponent } from './text-field/text-field.component'
import { WarningComponent } from './svg/warning/warning.component'
import { CloseFillComponent } from './svg/close-fill/close-fill.component'
import { NumberTextFieldComponent } from './number-text-field/number-text-field.component'
import { TextInputComponent } from './text-input/text-input.component'
import { VerificationFieldComponent } from './verification-field/verification-field.component'
import { TextfieldButtonComponent } from './textfield-button/textfield-button.component';
import { TextfieldDropdownComponent } from './textfield-dropdown/textfield-dropdown.component';
import { MemoComponent } from './memo/memo.component'

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
        TextButtonComponent,
        IconButtonComponent,
        IconGhostButtonComponent,
        RadioButtonComponent,
        ToggleButtonComponent,
        TabComponent,
        TabSmComponent,
        PageButtonComponent,
        TextFieldComponent,
        NumberTextFieldComponent,
        TextInputComponent,
        VerificationFieldComponent,
        TextfieldButtonComponent,
        // svg
        BallClipRotateComponent,
        CheckComponent,
        PlusComponent,
        UserListComponent,
        PencilComponent,
        GearComponent,
        DotsThreeComponent,
        CheckboxComponent,
        WarningComponent,
        CloseFillComponent,
        TextfieldDropdownComponent,
        MemoComponent,

        // etc
    ],
    imports: [NgxSpinnerModule, FormsModule, CommonModule, ReactiveFormsModule, DirectivesModule, PipesModule],
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
        TextButtonComponent,
        IconButtonComponent,
        IconGhostButtonComponent,
        CheckboxComponent,
        RadioButtonComponent,
        ToggleButtonComponent,
        TabComponent,
        TabSmComponent,
        PageButtonComponent,
        TextFieldComponent,
        NumberTextFieldComponent,
        TextInputComponent,
        VerificationFieldComponent,
        TextfieldButtonComponent,
        // svg
        BallClipRotateComponent,
        CheckComponent,
        PlusComponent,
        UserListComponent,
        PencilComponent,
        GearComponent,
        DotsThreeComponent,
        WarningComponent,
        CloseFillComponent,
        MemoComponent
    ],
    schemas: [],
})
export class AtomsModule {}
