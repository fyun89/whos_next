/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

/***** Angular modules *****/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/***** Basic app components *****/
import { RoutesModule } from './routes';

/***** Import WUF *****/
import { WufLayoutModule } from '@anviltech/wuf-ang-layout';

/***** 3rd party imports *****/
import { CustomMaterialModule } from '../../_internal/material.module';
import { TranslateSharedLazyModule } from '../../_internal/translate.module';

/***** Import page modules *****/
import { FeatureModuleHomeComponent } from './feature-module-home/feature-module-home.component';
import { FeatureModulePage1Component } from './feature-module-page-1/feature-module-page-1.component';
import { FeatureModulePage2Component } from './feature-module-page-2/feature-module-page-2.component';


@NgModule({
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    imports: [
        // Angular Imports
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CommonModule,

        // WUF
        WufLayoutModule,

        // 3rd Party Imports
        CustomMaterialModule,
        TranslateSharedLazyModule,

        // Routes (Keep as last module loaded)
        RoutesModule

    ],
    declarations: [
        // Page imports
        FeatureModuleHomeComponent,
        FeatureModulePage1Component,
        FeatureModulePage2Component
    ]
})
export class ExampleFeatureModule {
}
