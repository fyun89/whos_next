/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

import {WufContentFooterService} from '@anviltech/wuf-ang-layout';
import {FeatureModulePage2Component} from './feature-module-page-2.component';


describe('FeatureModulePage2Component', () => {
    let fixture: ComponentFixture<FeatureModulePage2Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ],
            declarations: [
                FeatureModulePage2Component
            ],
            providers: [
                WufContentFooterService
            ],
            imports: [
                RouterTestingModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeatureModulePage2Component);
        fixture.detectChanges();
    });

    it('should create', () => {
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

});
