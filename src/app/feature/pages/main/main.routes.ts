import { Route } from '@angular/router'
import { MainComponent } from './main.component'

export default [
    {
        path: '',
        component: MainComponent,
        children: [],
    },
] as Route[]
