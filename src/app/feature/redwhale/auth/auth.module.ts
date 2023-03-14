import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthRoutingModule } from './auth-routing.module'

import { SharedModule } from '@shared/shared.module'
import { ComponentsModule } from './components/components.module'

// components
import { TermsComponent } from './terms/terms.component'
import { LoginComponent } from './login/login.component'

@NgModule({
    declarations: [TermsComponent, LoginComponent],
    imports: [CommonModule, SharedModule, AuthRoutingModule, ComponentsModule],
})
export class AuthModule {}
