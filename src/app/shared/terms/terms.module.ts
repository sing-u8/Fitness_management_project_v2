import { NgModule } from '@angular/core'

import { TermsEULAComponent } from './terms-eula/terms-eula.component'
import { TermsPrivacyComponent } from './terms-privacy/terms-privacy.component'

@NgModule({
    declarations: [TermsEULAComponent, TermsPrivacyComponent],
    imports: [],
    exports: [TermsEULAComponent, TermsPrivacyComponent],
})
export class SharedTermsModule {}
