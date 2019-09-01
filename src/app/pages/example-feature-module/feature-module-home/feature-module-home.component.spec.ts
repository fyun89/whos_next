/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

import {WufContentFooterService} from '@anviltech/wuf-ang-layout';
import {FeatureModuleHomeComponent} from './feature-module-home.component';


describe('FeatureModuleHomeComponent', () => {
    let fixture: ComponentFixture<FeatureModuleHomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ],
            declarations: [
                FeatureModuleHomeComponent
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
        fixture = TestBed.createComponent(FeatureModuleHomeComponent);
        fixture.detectChanges();
    });

    it('should create', () => {
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

});
