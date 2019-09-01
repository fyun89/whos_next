/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {WufConfigurationService} from '@anviltech/wuf-ang-configuration';

import {AppComponent} from './app.component';
import {RoutesModule} from './app-routes';
import {ExamplePage1Component} from './pages/example-page-1/example-page-1.component';
import {UserService} from './_internal/services/user.service';


describe('AppComponent', () => {
    let fake_routes: Routes = [
        {path: '**', component: ExamplePage1Component}
    ];
    let fixture: ComponentFixture<AppComponent>;
    let comp: AppComponent;
    let de: DebugElement;
    let el: HTMLElement;

    // async beforeEach
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ],
            declarations: [
                AppComponent,
                ExamplePage1Component
            ],
            imports: [
                HttpClientModule,
                RouterTestingModule.withRoutes(fake_routes)
            ],
            providers: [
                RoutesModule,
                WufConfigurationService,
                UserService
            ]
        });
        // WebPack developers need not call compileComponents because it inlines templates and css as part of the
        // automated build process that precedes running the test.
        // .compileComponents(); compile template and css
    }));

    it('should create the app', async(() => {
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.debugElement.componentInstance;
        expect(comp).toBeTruthy();
    }));
});
