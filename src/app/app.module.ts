import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { environment } from '@environments/environment'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { CoreModule } from './core/core.module'
import { SharedModule } from '@shared/shared.module'

// ngrx
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { EffectsModule } from '@ngrx/effects'
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store'

import { StepperComponent } from './stepper/stepper.component'

@NgModule({
    declarations: [AppComponent, StepperComponent],
    imports: [BrowserModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
