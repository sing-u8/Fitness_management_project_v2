import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { TermsComponent } from './terms.component'
import { provideMockStore } from '@ngrx/store/testing'

import { AuthModule } from '../auth.module'
import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'

describe('TermsComponent - is not social User', () => {
    let component: TermsComponent
    let fixture: ComponentFixture<TermsComponent>

    const storageServiceStub: Partial<StorageService> = {
        getUser: () => {
            return {} as User
        },
        isUserEmpty: () => {
            return true
        },
        isSocialUser: () => {
            return false
        },
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TermsComponent],
            imports: [AuthModule, HttpClientTestingModule, RouterTestingModule],
            providers: [provideMockStore({}), { provide: StorageService, useValue: storageServiceStub }],
        }).compileComponents()

        fixture = TestBed.createComponent(TermsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should show none_social_user_next_button ng-template when isSocialUser is false', () => {
        // component.isSocialUser = storageServiceStub.isSocialUser()
        fixture.detectChanges()
        expect(component.isSocialUser).toBeFalsy()
        expect(fixture.debugElement.query(By.css('[data-testid=bt-next-for-normal]')).nativeElement).toBeTruthy()
    })
    it('check all things when bt-radio-all clicked', () => {
        const allButtonDe: DebugElement = fixture.debugElement.query(By.css('[data-testid=bt-radio-all]'))
        allButtonDe.nativeElement.click()
        fixture.detectChanges()
        expect(component.all).toBeTrue()
        expect(component.termsEULA).toBeTrue()
        expect(component.termsPrivacy).toBeTrue()
        expect(component.marketing).toBeTrue()
        expect(component.marketingSMS).toBeTrue()
        expect(component.marketingEmail).toBeTrue()
        expect(component.isValid).toBeTrue()
    })
    it('should block when eula and privacy both are not true', () => {
        expect(component.termsEULA).toBeFalse()
        expect(component.termsPrivacy).toBeFalse()
        expect(component.isValid).toBeFalse()

        fixture.debugElement.query(By.css('[data-testid=bt-radio-eula]')).nativeElement.click()
        fixture.detectChanges()
        expect(component.termsEULA).toBeTrue()
        expect(component.termsPrivacy).toBeFalse()
        expect(component.isValid).toBeFalse()

        fixture.debugElement.query(By.css('[data-testid=bt-radio-eula]')).nativeElement.click()
        fixture.debugElement.query(By.css('[data-testid=bt-radio-privacy]')).nativeElement.click()
        fixture.detectChanges()
        expect(component.termsEULA).toBeFalse()
        expect(component.termsPrivacy).toBeTrue()
        expect(component.isValid).toBeFalse()
    })
})
describe('TermsComponent - isSocialUser', () => {
    let component: TermsComponent
    let fixture: ComponentFixture<TermsComponent>

    const storageServiceStub: Partial<StorageService> = {
        getUser: () => {
            return {} as User
        },
        isUserEmpty: () => {
            return true
        },
        isSocialUser: () => {
            return true
        },
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TermsComponent],
            imports: [AuthModule, HttpClientTestingModule, RouterTestingModule],
            providers: [provideMockStore({}), { provide: StorageService, useValue: storageServiceStub }],
        }).compileComponents()

        fixture = TestBed.createComponent(TermsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })
    it('should show social_user_next_button ng-template when isSocialUser is true', () => {
        fixture.detectChanges()
        expect(component.isSocialUser).toBeTrue()
        expect(fixture.debugElement.query(By.css('.social-buttons')).nativeElement).toBeTruthy()
    })
    it('check all things when bt-radio-all clicked', () => {
        const allButtonDe: DebugElement = fixture.debugElement.query(By.css('[data-testid=bt-radio-all]'))
        allButtonDe.nativeElement.click()
        fixture.detectChanges()
        expect(component.all).toBeTrue()
        expect(component.termsEULA).toBeTrue()
        expect(component.termsPrivacy).toBeTrue()
        expect(component.marketing).toBeTrue()
        expect(component.marketingSMS).toBeTrue()
        expect(component.marketingEmail).toBeTrue()
        expect(component.isValid).toBeTrue()
    })
    it('should block when eula and privacy both are not true', () => {
        expect(component.termsEULA).toBeFalse()
        expect(component.termsPrivacy).toBeFalse()
        expect(component.isValid).toBeFalse()

        fixture.debugElement.query(By.css('[data-testid=bt-radio-eula]')).nativeElement.click()
        fixture.detectChanges()
        expect(component.termsEULA).toBeTrue()
        expect(component.termsPrivacy).toBeFalse()
        expect(component.isValid).toBeFalse()

        fixture.debugElement.query(By.css('[data-testid=bt-radio-eula]')).nativeElement.click()
        fixture.debugElement.query(By.css('[data-testid=bt-radio-privacy]')).nativeElement.click()
        fixture.detectChanges()
        expect(component.termsEULA).toBeFalse()
        expect(component.termsPrivacy).toBeTrue()
        expect(component.isValid).toBeFalse()
    })
})
