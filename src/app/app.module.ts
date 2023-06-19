import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { COMPOSITION_BUFFER_MODE } from '@angular/forms'

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
import { appFeatureKey, appReducer } from '@store/app/reducers/reducers'
import { metaReducers } from '@store/app/reducers/meta-reducers'
import { AppEffect } from '@store/app/effects/effects'

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

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
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
    exports: [],
    providers: [
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useValue: environment.RECAPTCHA_SITE_KEY,
        },
        // 한글 바로 입력되게 설정
        { provide: COMPOSITION_BUFFER_MODE, useValue: false },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
