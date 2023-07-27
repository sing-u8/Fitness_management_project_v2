import { Route, Routes } from '@angular/router'

import { AuthGuard } from '@guards/auth.guard'
import { RegPhoneGuard } from '@guards/reg-phone.guard'

import { RegInfoComponent } from '@pages/auth/reg-info/reg-info.component'
import { RegPhoneComponent } from '@pages/auth/reg-phone/reg-phone.component'
import { RegEmailComponent } from '@pages/auth/reg-email/reg-email.component'

export const RegistrationRoutes: Routes = [
    { path: '', redirectTo: 'info', pathMatch: 'full' },
    { path: 'info', canActivate: [AuthGuard], component: RegInfoComponent },
    { path: 'email', canActivate: [AuthGuard], component: RegEmailComponent },
    { path: 'phone', canActivate: [RegPhoneGuard], component: RegPhoneComponent },
]
