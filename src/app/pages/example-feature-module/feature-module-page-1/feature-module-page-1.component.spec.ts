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
import {FeatureModulePage1Component} from './feature-module-page-1.component';


describe('FeatureModulePage1Component', () => {
    let fixture: ComponentFixture<FeatureModulePage1Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ],
            declarations: [
                FeatureModulePage1Component
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
        fixture = TestBed.createComponent(FeatureModulePage1Component);
        fixture.detectChanges();
    });

    it('should create', () => {
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

});
