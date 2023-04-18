import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

// libraries
import { NgxSpinnerModule } from 'ngx-spinner'
import { AtomsModule } from '@shared/components/atoms/atoms.module'



@NgModule({
    declarations: [],
    imports: [NgxSpinnerModule, FormsModule, CommonModule, AtomsModule],
    exports: [],
    schemas: [],
})
export class MoleculesModule {}
