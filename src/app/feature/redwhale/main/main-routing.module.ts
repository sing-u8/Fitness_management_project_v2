import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

// components
import { DashboardComponent } from './dashboard/dashboard.component'

const routes: Routes = []

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MainRoutingModule {}
