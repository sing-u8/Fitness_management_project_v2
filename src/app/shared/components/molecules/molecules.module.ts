import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { NgScrollbar, ScrollViewport } from 'ngx-scrollbar'

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
import { CreateCenterModalComponent } from '@shared/components/molecules/create-center-modal/create-center-modal.component'
import { CenterListItemComponent } from './center-list-item/center-list-item.component'
import { CenterInfoDropdownComponent } from './center-info-dropdown/center-info-dropdown.component'
import { CenterProductInfoBoxComponent } from './center-product-info-box/center-product-info-box.component'
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'
import { SetCenterModalComponent } from '@shared/components/molecules/set-center/set-center-modal/set-center-modal.component'
import { SetCenterPolicyManagementComponent } from './set-center/set-center-policy-management/set-center-policy-management.component'
import { SetCenterPaymentManagementComponent } from './set-center/set-center-payment-management/set-center-payment-management.component'
import { SetCenterInfoComponent } from './set-center/set-center-info/set-center-info.component'
import { SetCenterEmployeeManagementComponent } from './set-center/set-center-employee-management/set-center-employee-management.component'
import { ChangeCenterNameModalComponent } from './change-center-name-modal/change-center-name-modal.component'
import { ChangeCenterPhoneNumberModalComponent } from './change-center-phone-number-modal/change-center-phone-number-modal.component'
import { CreateEmployeeModalComponent } from '@shared/components/molecules/set-center/create-employee-modal/create-employee-modal.component'
import { EmployeePhotoComponent } from './employee-photo/employee-photo.component'
import { EmployeeCardComponent } from './set-center/employee-card/employee-card.component'
import { UpdateEmployeeModalComponent } from './set-center/update-employee-modal/update-employee-modal.component'
import { PermissionManagementModalComponent } from './set-center/permission-management-modal/permission-management-modal.component'
import { ChangeCenterAddressModalComponent } from './change-center-address-modal/change-center-address-modal.component'
import { PaymentMethodManagementModalComponent } from './payment-method-management-modal/payment-method-management-modal.component'
import { PaymentCardListItemComponent } from '@shared/components/molecules/payment-card-list-item/payment-card-list-item.component'

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
        SetCenterPolicyManagementComponent,
        SetCenterPaymentManagementComponent,
        SetCenterInfoComponent,
        SetCenterEmployeeManagementComponent,
        ChangeCenterNameModalComponent,
        ChangeCenterPhoneNumberModalComponent,
        CreateEmployeeModalComponent,
        EmployeePhotoComponent,
        EmployeeCardComponent,
        UpdateEmployeeModalComponent,
        PermissionManagementModalComponent,
        ChangeCenterAddressModalComponent,
        PaymentMethodManagementModalComponent,
        PaymentCardListItemComponent,
    ],
    imports: [
        NgScrollbar,
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
        ScrollViewport,
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
        SetCenterPolicyManagementComponent,
        SetCenterPaymentManagementComponent,
        SetCenterInfoComponent,
        SetCenterEmployeeManagementComponent,
        ChangeCenterNameModalComponent,
        ChangeCenterPhoneNumberModalComponent,
        CreateEmployeeModalComponent,
        EmployeePhotoComponent,
        EmployeeCardComponent,
        UpdateEmployeeModalComponent,
        ChangeCenterAddressModalComponent,
        PaymentMethodManagementModalComponent,
        PaymentCardListItemComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class MoleculesModule {}
