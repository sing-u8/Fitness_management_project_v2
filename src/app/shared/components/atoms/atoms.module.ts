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
        // svg
        BallClipRotateComponent,
        CheckComponent,
        PlusComponent,
        UserListComponent,
        PencilComponent,
        GearComponent,
        DotsThreeComponent,
        CheckboxComponent,

        // etc
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
        TextButtonComponent,
        IconButtonComponent,
        IconGhostButtonComponent,
        CheckboxComponent,
        RadioButtonComponent,
        ToggleButtonComponent,
        TabComponent,
        TabSmComponent,
        PageButtonComponent,
        //
        BallClipRotateComponent,
        CheckComponent,
        PlusComponent,
        UserListComponent,
        PencilComponent,
        GearComponent,
        DotsThreeComponent,
    ],
    schemas: [],
})
export class AtomsModule {}
