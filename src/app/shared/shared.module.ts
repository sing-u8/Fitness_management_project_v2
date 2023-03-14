import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

// ngx libraries
import { NgxGaugeModule } from 'ngx-gauge'
import { NgxSpinnerModule } from 'ngx-spinner'
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

// components
import { TermsEULAComponent } from './terms/terms-eula/terms-eula.component'
import { TermsPrivacyComponent } from './terms/terms-privacy/terms-privacy.component'

// modules
import { SharedTermsModule } from './terms/terms.module'
import { SharedComponentsModule } from './components/components.module'
import { PipesModule } from './pipes/pipes.module'
import { DirectivesModule } from './directives/directives.module'

@NgModule({
    declarations: [],
    imports: [CommonModule, FormsModule],
    exports: [
        // angular
        FormsModule,
        // modules
        SharedTermsModule,
        SharedComponentsModule,
        PipesModule,
        DirectivesModule,
    ],
    // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
