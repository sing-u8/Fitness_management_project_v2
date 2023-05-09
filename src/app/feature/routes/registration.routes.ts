import { Route, Routes } from '@angular/router'

import { AuthGuard } from '@guards/auth.guard'
import { RegPhoneGuard } from '@guards/reg-phone.guard'
import { RegCompletedGuard } from '@guards/reg-completed.guard'

import { RegCompletedComponent } from '@feature/pages/auth/reg-completed/reg-completed.component'
import { RegInfoComponent } from '@feature/pages/auth/reg-info/reg-info.component'
import { RegPhoneComponent } from '@feature/pages/auth/reg-phone/reg-phone.component'
import { RegEmailComponent } from '@feature/pages/auth/reg-email/reg-email.component'

export const RegistrationRoutes = [
    { path: '', redirectTo: 'info', pathMatch: 'full' },
    { path: 'info', canActivate: [AuthGuard], component: RegInfoComponent },
    { path: 'email', canActivate: [AuthGuard], component: RegEmailComponent },
    { path: 'phone', canActivate: [RegPhoneGuard], component: RegPhoneComponent },
] as Routes
