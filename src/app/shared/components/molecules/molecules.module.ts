import { NgModule } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
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
import { RegisterCardModalComponent } from './register-card-modal/register-card-modal.component'
import { RegisterCardResultModalComponent } from './register-card-result-modal/register-card-result-modal.component'
import { MyProfileModalComponent } from './my-profile-modal/my-profile-modal.component'
import { ProfilePhotoComponent } from './profile-photo/profile-photo.component'
import { SharedTermsModule } from '@shared/terms/terms.module'
import { ChangeUserNameModalComponent } from './change-user-name-modal/change-user-name-modal.component'
import { ChangeUserPhoneNumberModalComponent } from './change-user-phone-number-modal/change-user-phone-number-modal.component'
import { ChangeUserGenderModalComponent } from './change-user-gender-modal/change-user-gender-modal.component'
import { ChangeUserBirthDateModalComponent } from './change-user-birth-date-modal/change-user-birth-date-modal.component'
import { ChangeUserMarketingModalComponent } from './change-user-marketing-modal/change-user-marketing-modal.component'
import { ChangeUserPasswordModalComponent } from './change-user-password-modal/change-user-password-modal.component'
import { DeleteAccountModalComponent } from './delete-account-modal/delete-account-modal.component'
import { CenterPhotoComponent } from './center-photo/center-photo.component'
import { CreateCenterModalComponent } from './create-center-modal/create-center-modal.component'
import { CenterListItemComponent } from './center-list-item/center-list-item.component'
import { CenterInfoDropdownComponent } from './center-info-dropdown/center-info-dropdown.component'
import { CenterProductInfoBoxComponent } from './center-product-info-box/center-product-info-box.component'
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'
import { SetCenterModalComponent } from './set-center-modal/set-center-modal.component'

@NgModule({
    declarations: [
        DatepickerComponent,
        TmDatepickerComponent,
        PhoneCertificationModalComponent,
        RegisterCardModalComponent,
        RegisterCardResultModalComponent,
        MyProfileModalComponent,
        ProfilePhotoComponent,
        ChangeUserNameModalComponent,
        ChangeUserPhoneNumberModalComponent,
        ChangeUserGenderModalComponent,
        ChangeUserBirthDateModalComponent,
        ChangeUserMarketingModalComponent,
        ChangeUserPasswordModalComponent,
        DeleteAccountModalComponent,
        CenterPhotoComponent,
        CreateCenterModalComponent,
        CenterListItemComponent,
        CenterInfoDropdownComponent,
        CenterProductInfoBoxComponent,
        SetCenterModalComponent,
    ],
    imports: [
        NgxSpinnerModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        DirectivesModule,
        PipesModule,
        AtomsModule,
        NgOptimizedImage,
        SharedTermsModule,
        NgxSkeletonLoaderModule,
    ],
    exports: [
        DatepickerComponent,
        TmDatepickerComponent,
        PhoneCertificationModalComponent,
        RegisterCardModalComponent,
        RegisterCardResultModalComponent,
        MyProfileModalComponent,
        ProfilePhotoComponent,
        ChangeUserNameModalComponent,
        ChangeUserPhoneNumberModalComponent,
        ChangeUserGenderModalComponent,
        ChangeUserBirthDateModalComponent,
        ChangeUserMarketingModalComponent,
        ChangeUserPasswordModalComponent,
        DeleteAccountModalComponent,
        CenterPhotoComponent,
        CreateCenterModalComponent,
        CenterListItemComponent,
        CenterInfoDropdownComponent,
        CenterProductInfoBoxComponent,
        SetCenterModalComponent,
    ],
    schemas: [],
})
export class MoleculesModule {}
