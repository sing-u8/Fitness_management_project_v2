import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthRoutingModule } from './auth-routing.module'

import { SharedModule } from '@shared/shared.module'

// components
import { AuthHeaderComponent } from './components/auth-header/auth-header.component'
import { TermsComponent } from './terms/terms.component'
import { LoginComponent } from './login/login.component'

@NgModule({
    declarations: [AuthHeaderComponent, TermsComponent, LoginComponent],
    imports: [CommonModule, SharedModule, AuthRoutingModule],
})
export class AuthModule {}
