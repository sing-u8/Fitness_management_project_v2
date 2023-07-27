import { enableProdMode, importProvidersFrom } from '@angular/core'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { AppComponent } from './app/app.component'
import { AppRoutes } from '@routes/app.routes'

import { environment } from '@environments/environment'
import { HttpClientModule } from '@angular/common/http'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { getAuth, provideAuth } from '@angular/fire/auth'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AuthModule as AngularFireAuthModule } from '@angular/fire/auth/auth.module'
import { StorageModule as AngularFirestoreModule } from '@angular/fire/storage/storage.module'
import { StoreModule } from '@ngrx/store'
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store'
import { appFeatureKey, appReducer } from '@store/app/reducers/reducers'
import { metaReducers } from '@store/app/reducers/meta-reducers'
import { EffectsModule } from '@ngrx/effects'
import { AppEffect } from '@store/app/effects/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha'
import { COMPOSITION_BUFFER_MODE } from '@angular/forms'
import { CoreModule } from './app/core/core.module'

if (environment.production) {
    enableProdMode()
}

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(AppRoutes),
        importProvidersFrom(
            BrowserModule,
            BrowserAnimationsModule,
            HttpClientModule,
            // firebase
            provideFirebaseApp(() => initializeApp(environment.firebase)),
            provideFirestore(() => getFirestore()),
            provideAuth(() => getAuth()),
            // AngularFireAuthModule,
            // AngularFirestoreModule,
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
            // etc
            CoreModule
        ),
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useValue: environment.RECAPTCHA_SITE_KEY,
        },
        // 한글 바로 입력되게 설정
        { provide: COMPOSITION_BUFFER_MODE, useValue: false },
    ],
}).catch((err) => console.error(err))

// platformBrowserDynamic()
//     .bootstrapModule(AppModule)
//     .catch((err) => console.error(err))
