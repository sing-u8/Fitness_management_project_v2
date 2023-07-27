import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '@guards/auth.guard'

import { NotFoundComponent } from '@shared/route-components/not-found/not-found.component'
import { ComponentComponent } from '@pages/component/component.component'
import { CenterGuard } from '@guards/center.guard'

export const AppRoutes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    {
        path: 'auth',
        loadChildren: () => import('@routes/auth.routes').then((r) => r.AuthRoutes),
    },
    {
        path: ':center-name/payment',
        canActivate: [AuthGuard],
        loadComponent: () => import('@pages/payment/payment.component').then((m) => m.PaymentComponent),
    },
    {
        path: ':center-name/main',
        canActivate: [AuthGuard, CenterGuard],
        loadChildren: () => import('@routes/main.routes').then((r) => r.MainRoutes),
    },
    {
        path: 'redwhale-home',
        canActivate: [AuthGuard],
        loadComponent: () => import('@pages/center-list/center-list.component').then((m) => m.CenterListComponent),
    },
    {
        path: 'components',
        component: ComponentComponent,
    },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' },
]
