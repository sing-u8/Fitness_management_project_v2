import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '@guards/auth.guard'
// import { CenterGuard } from '@guards/center.guard'

import { NotFoundComponent } from '@shared/route-components/not-found/not-found.component'

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./feature/redwhale/auth/auth.module').then((m) => m.AuthModule),
    },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
