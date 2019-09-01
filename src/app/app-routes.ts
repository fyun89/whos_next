/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

/***** Import page layouts *****/
import {LayoutsModule, LayoutBasicComponent, LayoutMainComponent} from './_internal/layouts/layouts.module';

/***** Import page modules *****/
// Error pages
import {PageNotFoundComponent} from './other/page-not-found/page-not-found.component';
import {ForbiddenComponent} from './other/forbidden/forbidden.component';

// Other placeholder pages
import {SettingsComponent} from './other/settings/settings.component';

// Pages
import {ExamplePage1Component} from './pages/example-page-1/example-page-1.component';
import {ExamplePage2Component} from './pages/example-page-2/example-page-2.component';

// Pages with main layout (header, footer, nav, content area)
const routes_layout_main = [
    {path: '', component: ExamplePage1Component, pathMatch: 'full'},
    {path: 'example-page-2', component: ExamplePage2Component, pathMatch: 'full'}
];

// Pages with basic layout (no header, footer, or nav)
const routes_layout_basic = [
    /* Error routes */
    {path: 'forbidden', component: ForbiddenComponent, pathMatch: 'full'}
];

const routes = [
    // Eager-load components based on their respective layouts, identified above
    {path: '', component: LayoutMainComponent, children: routes_layout_main},
    {path: '', component: LayoutBasicComponent, children: routes_layout_basic},

    // Lazy load feature modules
    {
        path: 'example-feature-module',
        loadChildren: './pages/example-feature-module/example-feature-module.module#ExampleFeatureModule'
    },

    // 404.  If all else fails, go here.  (Keep this as last route)
    {
        path: '', component: LayoutBasicComponent, children: [
            {path: '**', component: PageNotFoundComponent, pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        LayoutsModule,
        RouterModule.forRoot(routes)
    ]
})
export class RoutesModule {
}
