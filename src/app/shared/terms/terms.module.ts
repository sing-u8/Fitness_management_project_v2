import { NgModule } from '@angular/core'

import { TermsEULAComponent } from './terms-eula/terms-eula.component'
import { TermsPrivacyComponent } from './terms-privacy/terms-privacy.component'
import { AtomsModule } from '@shared/components/atoms/atoms.module'

@NgModule({
    declarations: [TermsEULAComponent, TermsPrivacyComponent],
    imports: [AtomsModule],
    exports: [TermsEULAComponent, TermsPrivacyComponent],
})
export class SharedTermsModule {}
