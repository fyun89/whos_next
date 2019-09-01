/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { WufConfigurationService } from '@anviltech/wuf-ang-configuration';
import { WufNavigationModule, WufNavigationService } from '@anviltech/wuf-ang-navigation';
import { WufLayoutModule, WufLayoutService, WufSidebarService } from '@anviltech/wuf-ang-layout';

import { LayoutMainComponent } from './main.component';


describe('LayoutMainComponent', () => {
    let fixture: ComponentFixture<LayoutMainComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LayoutMainComponent],
            imports: [
                RouterTestingModule,
                HttpClientModule,
                WufLayoutModule,
                WufNavigationModule,
                HttpClientTestingModule // Mock backend for navigation service
            ],
            providers: [
                WufConfigurationService,
                WufSidebarService,
                WufLayoutService,
                WufNavigationService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LayoutMainComponent);
        fixture.detectChanges();
    });

    it('should create', () => {
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    describe('Layout elements', () => {
        it('should have a wuf-view-main element', () => {
            de = fixture.debugElement.query(By.css('wuf-view-main'));
            el = de.nativeElement;
            expect(de).toBeTruthy();
        });

        it('should have a router-outlet', () => {
            de = fixture.debugElement.query(By.css('router-outlet'));
            el = de.nativeElement;
            expect(de).toBeTruthy();
        });
    });

    it(`should issue a request for navigation`,
        // 1. declare as async test since the HttpClient works with Observables
        async(
            // 2. inject HttpClient and HttpTestingController into the test
            inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
                // 3. Verify that only a single request has been issued for this URL
                backend.expectOne({
                    url: '/api/navigation',
                    method: 'GET'
                });
            })
        )
    );
});
