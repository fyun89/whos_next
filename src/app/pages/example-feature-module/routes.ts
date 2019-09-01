/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

/***** Import page layouts *****/
import {LayoutBasicComponent, LayoutMainComponent, LayoutsModule} from '../../_internal/layouts/layouts.module';


/***** Import page modules *****/
import {FeatureModuleHomeComponent} from './feature-module-home/feature-module-home.component';
import {FeatureModulePage1Component} from './feature-module-page-1/feature-module-page-1.component';
import {FeatureModulePage2Component} from './feature-module-page-2/feature-module-page-2.component';


// Pages with main layout (header, footer, nav, content area)
const routes_layout_main = [
    {path: '', component: FeatureModuleHomeComponent, pathMatch: 'full'},
    {path: 'feature-module-page-1', component: FeatureModulePage1Component, pathMatch: 'full'},
    {path: 'feature-module-page-2', component: FeatureModulePage2Component, pathMatch: 'full'}
];

// Pages with basic layout (no header, footer, or nav)
const routes_layout_basic = [];


const routes = [
    {
        path: '',
        // canActivateChild: [AuthGuard], // Ensures user is authenticated before allowing access to any child route
        children: [
            {
                path: '', // This is a component-less route, which makes it easier to guard child routes,
                // canActivateChild: [AuthGuard], // Ensures user is authenticated before allowing access to any child route
                component: LayoutMainComponent,
                children: routes_layout_main
            },
            {
                path: '', // This is a component-less route, which makes it easier to guard child routes,
                // canActivateChild: [AuthGuard], // Ensures user is authenticated before allowing access to any child route
                component: LayoutBasicComponent,
                children: routes_layout_basic
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        LayoutsModule,
        RouterModule.forChild(routes)
    ]
})
export class RoutesModule {
}
