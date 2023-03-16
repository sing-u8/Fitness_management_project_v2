import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthRoutingModule } from './auth-routing.module'

import { SharedModule } from '@shared/shared.module'
import { ComponentsModule } from './components/components.module'
import { MobileResetPasswordModule } from './mobile-reset-password/mobile-reset-password.module'

// components
import { TermsComponent } from './terms/terms.component'
import { LoginComponent } from './login/login.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component'

@NgModule({
    declarations: [TermsComponent, LoginComponent, ForgotPasswordComponent, ResetPasswordComponent],
    imports: [CommonModule, SharedModule, AuthRoutingModule, ComponentsModule, MobileResetPasswordModule],
})
export class AuthModule {}
