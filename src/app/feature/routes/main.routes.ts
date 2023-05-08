import { Route } from '@angular/router'
import { MainComponent } from '../pages/main/main.component'

export const MainRoutes = [
    {
        path: '',
        component: MainComponent,
        children: [],
    },
] as Route[]
