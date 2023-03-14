import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'

import { RegistrationRoutingModule } from './registration-routing.module'
import { SharedModule } from '@shared/shared.module'
import { FormsModule } from '@angular/forms'

import { ComponentsModule } from '../components/components.module'

import { InfoComponent } from './info/info.component'
import { EmailComponent } from './email/email.component'
import { PhoneComponent } from './phone/phone.component'
import { CompletedComponent } from './completed/completed.component'

// sub component
// import { EmailModalComponent } from '../components/email-modal/email-modal.component'

@NgModule({
    declarations: [
        InfoComponent,
        EmailComponent,
        PhoneComponent,
        CompletedComponent,
        // sub component
        // EmailModalComponent,
    ],
    imports: [FormsModule, AngularCommonModule, RegistrationRoutingModule, SharedModule, ComponentsModule],
    exports: [],
    providers: [],
})
export class RegistrationModule {}
