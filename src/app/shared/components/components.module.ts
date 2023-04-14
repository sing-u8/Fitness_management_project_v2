import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

// ngx libraries
import { NgxGaugeModule } from 'ngx-gauge'
import { NgxSpinnerModule } from 'ngx-spinner'
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

// modules
import { AtomsModule } from './atoms/atoms.module'
import { MoleculesModule } from './molecules/molecules.module'
import { OrganismsModule } from './organisms/organisms.module'
import { TemplatesModule } from './templates/templates.module'

@NgModule({
    declarations: [],
    imports: [],
    exports: [
        NgxGaugeModule,
        NgxSpinnerModule,
        NgxSkeletonLoaderModule,
        FormsModule,
        CommonModule,
        AtomsModule,
        MoleculesModule,
        OrganismsModule,
        TemplatesModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedComponentsModule {}
