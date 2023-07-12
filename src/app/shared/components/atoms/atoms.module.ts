import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { NgScrollbar, ScrollViewport } from 'ngx-scrollbar'

// modules
import { DirectivesModule } from '@shared/directives/directives.module'
import { PipesModule } from '@shared/pipes/pipes.module'

// components

// libraries
import { NgxSpinnerModule } from 'ngx-spinner'

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
import { CaretDownComponent } from './svg/caret-down/caret-down.component'
import { AvatarSmileyComponent } from './svg/avatar-smiley/avatar-smiley.component'
import { QuestionDuotoneComponent } from './svg/question-duotone/question-duotone.component'
import { CaretUpComponent } from './svg/caret-up/caret-up.component'
import { CoinComponent } from '@shared/components/atoms/svg/coin/coin.component'

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
import {
    IconButtonComponent,
    IconButtonPendingContentDirective,
    IconButtonDoneContentDirective,
    IconButtonIdleContentDirective,
} from './icon-button/icon-button.component'
import {
    IconGhostButtonComponent,
    IconGhostButtonPendingContentDirective,
    IconGhostButtonIdleContentDirective,
    IconGhostButtonDoneContentDirective,
} from './icon-ghost-button/icon-ghost-button.component'
import { CheckboxComponent } from './checkbox/checkbox.component'
import { NumberTextFieldComponent } from './number-text-field/number-text-field.component'
import { TextInputComponent } from './text-input/text-input.component'
import { VerificationFieldComponent } from './verification-field/verification-field.component'
import { TextfieldButtonComponent } from './textfield-button/textfield-button.component'
import { TextfieldDropdownComponent } from './textfield-dropdown/textfield-dropdown.component'
import { MemoComponent } from './memo/memo.component'
import { ModalComponent } from '@shared/components/atoms/modal/modal.component'
import { TextareaModalComponent } from './textarea-modal/textarea-modal.component'
import { CloseComponent } from './svg/close/close.component'
import { CaretCdlComponent } from './svg/caret-cdl/caret-cdl.component'
import { CaretCdrComponent } from './svg/caret-cdr/caret-cdr.component'
import { CaretClComponent } from './svg/caret-cl/caret-cl.component'
import { CaretCrComponent } from './svg/caret-cr/caret-cr.component'
import { ArrowLeftBoldComponent } from './svg/arrow-left-bold/arrow-left-bold.component'
import { ArrowRightBoldComponent } from './svg/arrow-right-bold/arrow-right-bold.component'
import { ToastComponent } from '@shared/components/atoms/toast/toast.component'
import { VacantModalComponent } from './vacant-modal/vacant-modal.component'
import { XsIconButtonComponent } from './xs-icon-button/xs-icon-button.component'
import { SlideButtonComponent } from './slide-button/slide-button.component'
import { PaymentCardComponent } from './payment-card/payment-card.component'
import { TooltipComponent } from './tooltip/tooltip.component'
import { BadgeComponent } from './badge/badge.component'
import { FlipComponent } from './flip/flip.component'
import { AddCardButtonComponent } from './add-card-button/add-card-button.component'

@NgModule({
    declarations: [
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
        CloseComponent,
        CaretCdlComponent,
        CaretCdrComponent,
        CaretClComponent,
        CaretCrComponent,
        ArrowLeftBoldComponent,
        ArrowRightBoldComponent,
        CaretDownComponent,
        AvatarSmileyComponent,
        QuestionDuotoneComponent,
        CaretUpComponent,
        CoinComponent,
        // etc
        // components
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
        IconButtonPendingContentDirective,
        IconButtonDoneContentDirective,
        IconButtonIdleContentDirective,
        IconGhostButtonComponent,
        IconGhostButtonPendingContentDirective,
        IconGhostButtonIdleContentDirective,
        IconGhostButtonDoneContentDirective,
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
        TextfieldDropdownComponent,
        MemoComponent,
        ModalComponent,
        TextareaModalComponent,
        ToastComponent,
        VacantModalComponent,
        XsIconButtonComponent,
        SlideButtonComponent,
        PaymentCardComponent,
        TooltipComponent,
        BadgeComponent,
        FlipComponent,
        AddCardButtonComponent,
    ],
    imports: [
        ScrollViewport,
        NgScrollbar,
        NgxSpinnerModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        DirectivesModule,
        PipesModule,
    ],
    exports: [
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
        CloseComponent,
        CaretCdlComponent,
        CaretCdrComponent,
        CaretClComponent,
        CaretCrComponent,
        ArrowLeftBoldComponent,
        ArrowRightBoldComponent,
        CaretDownComponent,
        AvatarSmileyComponent,
        QuestionDuotoneComponent,
        CaretUpComponent,
        CoinComponent,
        // components
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
        IconButtonPendingContentDirective,
        IconButtonDoneContentDirective,
        IconButtonIdleContentDirective,
        IconGhostButtonComponent,
        IconGhostButtonPendingContentDirective,
        IconGhostButtonIdleContentDirective,
        IconGhostButtonDoneContentDirective,
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
        TextfieldDropdownComponent,
        MemoComponent,
        ModalComponent,
        TextareaModalComponent,
        ToastComponent,
        VacantModalComponent,
        XsIconButtonComponent,
        SlideButtonComponent,
        PaymentCardComponent,
        TooltipComponent,
        BadgeComponent,
        FlipComponent,
        AddCardButtonComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AtomsModule {}
