import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from '@guards/auth.guard'
import { TermsGuard } from '@guards/terms.guard'

import { TermsComponent } from './terms/terms.component'

const routes: Routes = [
    { path: '', redirectTo: 'terms', pathMatch: 'full' },
    // { path: 'login', canActivate: [AuthGuard], component: LoginComponent },
    // { path: 'email', canActivate: [AuthGuard], component: EmailLoginComponent },
    { path: 'terms', component: TermsComponent },
    // {
    //   path: 'registration',
    //   loadChildren: () => import('./registration/registration.module').then((m) => m.RegistrationModule),
    // },
    // {
    //   path: 'forgot-password',
    //   canActivate: [AuthGuard],
    //   component: ForgotPasswordComponent,
    // },
    // {
    //   path: 'reset-password',
    //   canActivate: [AuthGuard],
    //   component: ResetPasswordComponent,
    // },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}