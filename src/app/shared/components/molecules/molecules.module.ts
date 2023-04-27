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

@NgModule({
    declarations: [DatepickerComponent, TmDatepickerComponent],
    imports: [
        NgxSpinnerModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        DirectivesModule,
        PipesModule,
        AtomsModule,
    ],
    exports: [DatepickerComponent, TmDatepickerComponent],
    schemas: [],
})
export class MoleculesModule {}
