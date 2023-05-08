import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '@guards/auth.guard'
// import { CenterGuard } from '@guards/center.guard'

import { NotFoundComponent } from '@shared/route-components/not-found/not-found.component'
import { ComponentComponent } from '@pages/component/component.component'

const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    {
        path: 'auth',
        loadChildren: () => import('@feature/routes/auth.routes').then((r) => r.AuthRoutes),
    },
    {
        path: 'main',
        canActivate: [AuthGuard],
        loadChildren: () => import('@feature/routes/main.routes').then((r) => r.MainRoutes),
    },
    {
        path: 'components',
        component: ComponentComponent,
    },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
