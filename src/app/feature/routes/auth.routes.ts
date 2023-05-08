import { Routes } from '@angular/router'

// guards
import { TermsGuard } from '@guards/terms.guard'
import { AuthGuard } from '@guards/auth.guard'
import { RegPhoneGuard } from '@guards/reg-phone.guard'
import { RegCompletedGuard } from '@guards/reg-completed.guard'

// components
import { ForgotPasswordComponent } from '@feature/pages/auth/forgot-password/forgot-password.component'
import { LoginComponent } from '@feature/pages/auth/login/login.component'
import { ResetPasswordComponent } from '@feature/pages/auth/reset-password/reset-password.component'
import { TermsComponent } from '@feature/pages/auth/terms/terms.component'

export const AuthRoutes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'terms', canActivate: [TermsGuard], component: TermsComponent },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
    },
    {
        path: 'registration',
        loadChildren: () => import('./registration.routes').then((r) => r.RegistrationRoutes),
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
] as Routes
