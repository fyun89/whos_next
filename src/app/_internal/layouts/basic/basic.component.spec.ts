/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {WufLayoutModule} from '@anviltech/wuf-ang-layout';
import {WufNavigationModule} from '@anviltech/wuf-ang-navigation';

import {LayoutBasicComponent} from './basic.component';


describe('LayoutBasicComponent', () => {
    let fixture: ComponentFixture<LayoutBasicComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LayoutBasicComponent],
            imports: [
                RouterTestingModule,
                WufLayoutModule,
                WufNavigationModule
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LayoutBasicComponent);
        fixture.detectChanges();
    });

    it('should be created', () => {
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });
});
