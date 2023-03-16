// This file is required by karma.conf.js
// and loads recursively all the .spec and framework files

import 'zone.js/testing'
import { getTestBed } from '@angular/core/testing'
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing'
import { ngMocks } from 'ng-mocks'

declare const require: {
    context(
        path: string,
        deep?: boolean,
        filter?: RegExp
    ): {
        <T>(id: string): T
        keys(): string[]
    }
}

// auto spy
ngMocks.autoSpy('jasmine')
// In case, if you use @angular/router and Angular 14+.
// You might want to set a mock of DefaultTitleStrategy as TitleStrategy.
// A14 fix: making DefaultTitleStrategy to be a default mock for TitleStrategy
import { DefaultTitleStrategy, TitleStrategy } from '@angular/router'
import { MockService } from 'ng-mocks'
ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy))
// Usually, *ngIf and other declarations from CommonModule aren't expected to be mocked.
// The code below keeps them.
import { CommonModule } from '@angular/common'
import { ApplicationModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
ngMocks.globalKeep(ApplicationModule, true)
ngMocks.globalKeep(CommonModule, true)
ngMocks.globalKeep(BrowserModule, true)

// auto restore for jasmine and jest <27
// declare const jasmine: any;
import { MockInstance } from 'ng-mocks'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
jasmine.getEnv().addReporter({
    specDone: MockInstance.restore,
    specStarted: MockInstance.remember,
    suiteDone: MockInstance.restore,
    suiteStarted: MockInstance.remember,
})

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/)
// And load the modules.
context.keys().map(context)
