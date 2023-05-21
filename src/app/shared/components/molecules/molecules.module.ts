import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

// modules
import { DirectivesModule } from '@shared/directives/directives.module'
import { PipesModule } from '@shared/pipes/pipes.module'

// libraries
import { NgxSpinnerModule } from 'ngx-spinner'
import { AtomsModule } from '@shared/components/atoms/atoms.module'

import { DatepickerComponent } from './datepicker/datepicker.component'
import { TmDatepickerComponent } from './tm-datepciker/tm-datepicker.component'
import { PhoneCertificationModalComponent } from './phone-certification-modal/phone-certification-modal.component'

@NgModule({
    declarations: [DatepickerComponent, TmDatepickerComponent, PhoneCertificationModalComponent],
    imports: [
        NgxSpinnerModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        DirectivesModule,
        PipesModule,
        AtomsModule,
    ],
    exports: [DatepickerComponent, TmDatepickerComponent, PhoneCertificationModalComponent],
    schemas: [],
})
export class MoleculesModule {}
