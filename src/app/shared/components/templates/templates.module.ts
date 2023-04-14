import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AtomsModule } from '@shared/components/atoms/atoms.module'
import { MoleculesModule } from '@shared/components/molecules/molecules.module'
import { OrganismsModule } from '@shared/components/organisms/organisms.module'

@NgModule({
    declarations: [],
    imports: [CommonModule, AtomsModule, MoleculesModule, OrganismsModule],
    exports: [],
    schemas: [],
})
export class TemplatesModule {}
