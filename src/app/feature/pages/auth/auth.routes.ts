import { Route } from '@angular/router'

// guards
import { AuthGuard } from '@guards/auth.guard'
import { TermsGuard } from '@guards/terms.guard'

// components
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { LoginComponent } from './login/login.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { TermsComponent } from './terms/terms.component'

export default [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'terms', component: TermsComponent },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
    },
    // { path: 'login', canActivate: [AuthGuard], component: LoginComponent },
    // { path: 'terms', canActivate: [TermsGuard], component: TermsComponent },
    // {
    //     path: 'forgot-password',
    //     canActivate: [AuthGuard],
    //     component: ForgotPasswordComponent,
    // },
    // {
    //     path: 'reset-password',
    //     canActivate: [AuthGuard],
    //     component: ResetPasswordComponent,
    // },
] as Route[]
