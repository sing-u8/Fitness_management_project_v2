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
// - // store
import { appFeatureKey, appReducer } from '@appStore/reducers/reducers'
import { metaReducers } from '@appStore/reducers/meta-reducers'
import { AppEffect } from '@appStore/effects/effects'

// Firebase
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app'
import {
    connectFirestoreEmulator,
    enableIndexedDbPersistence,
    getFirestore,
    provideFirestore,
} from '@angular/fire/firestore'
import { AuthModule as AngularFireAuthModule } from '@angular/fire/auth'
import { StorageModule as AngularFirestoreModule } from '@angular/fire/storage'
import { provideAuth, connectAuthEmulator, getAuth } from '@angular/fire/auth'

// Google reCAPTCHA
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha'

import { StepperComponent } from './stepper/stepper.component'

@NgModule({
    declarations: [AppComponent, StepperComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        // firebase
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => {
            const fireStore = getFirestore()
            // console.log('in app module fireStore: ', fireStore)
            // connectFirestoreEmulator(fireStore, 'localhost', 4200);
            // enableIndexedDbPersistence(fireStore);
            return fireStore
        }),
        provideAuth(() => getAuth()),
        AngularFireAuthModule,
        AngularFirestoreModule,
        // ngrx
        StoreModule.forRoot(
            {
                router: routerReducer,
                [appFeatureKey]: appReducer,
            },
            { metaReducers }
        ),
        StoreRouterConnectingModule.forRoot(),
        EffectsModule.forRoot([AppEffect]),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
        }),
        // Google reCAPTCHA
        RecaptchaV3Module,
        // module
        SharedModule,
        CoreModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
