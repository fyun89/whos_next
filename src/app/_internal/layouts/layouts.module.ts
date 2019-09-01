/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

import { CUSTOM_ELEMENTS_SCHEMA, NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/***** Import WUF *****/
import { WufConfigurationService } from '@anviltech/wuf-ang-configuration';
import { WufLayoutModule, WufSidebarService } from '@anviltech/wuf-ang-layout';
import { WufNavigationModule } from '@anviltech/wuf-ang-navigation';
import { WufDrawerModule } from '@anviltech/wuf-ang-drawer';

/***** 3rd Party *****/
import { MatTooltipModule } from '@angular/material';
import { CustomMaterialModule } from '../material.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

/***** Local layout components *****/
import { LayoutMainComponent } from './main/main.component';
import { LayoutBasicComponent } from './basic/basic.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/***** Exports *****/
export { LayoutMainComponent } from './main/main.component';
export { LayoutBasicComponent } from './basic/basic.component';

// Create a factory for the translate loader
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    imports: [
        CommonModule,
        RouterModule,
        CustomMaterialModule,
        MatTooltipModule,

        // 3rd party
        TranslateModule,

        // WUF
        WufLayoutModule,
        WufNavigationModule,
        WufDrawerModule
    ],
    declarations: [
        LayoutMainComponent,
        LayoutBasicComponent
    ]
})
export class LayoutsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LayoutsModule,
            providers: [
                // Add any services used by this module to the providers collection
                WufConfigurationService,
                TranslateService,
                WufSidebarService
            ]
        };
    }
}
