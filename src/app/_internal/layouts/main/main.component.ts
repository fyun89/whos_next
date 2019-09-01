/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { WufNavigationService } from '@anviltech/wuf-ang-navigation';
import { WufConfigurationService } from '@anviltech/wuf-ang-configuration';
import { WufDrawerService } from '@anviltech/wuf-ang-drawer';


@Component({
    selector: 'app-layout-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class LayoutMainComponent implements OnInit, OnDestroy {

    navDataUrl: string = '/api/navigation'; // Set the URL from which to fetch the routes/navigation data object.
    navData: any;
    logoRoute: string = '/'; // Route path to take users when clicking on header logo
    configSubscription: Subscription;

    currentLanguage: object;
    languages: any = [];
    translateSubscription: Subscription;

    // Translated strings
    drawerHeader: string;
    darkThemeLabel: string;
    lang_en: string;
    lang_zh: string;

    constructor(
        public translate: TranslateService,
        private navService: WufNavigationService,
        public configService: WufConfigurationService,
        private drawerService: WufDrawerService
    ) {
        this.translateSubscription = translate.onLangChange.subscribe(($event: LangChangeEvent) => {
            this.onLanguageChange($event);
        });
    }

    ngOnInit() {
        // Fetch nav data
        this.navService.getNavData(this.navDataUrl).subscribe(
            results => {
                this.navData = results.data.links;
            },
            err => {
                console.error('Error retrieving nav data:', err);
            }
        );

        // Subscribe to configuration updates
        this.configSubscription = this.configService.onConfigChange().subscribe(
            newConfig => {
                this.onConfigChange(newConfig);
            },
            err => {
                console.warn('error on subscription:', err);
            }
        );

        // Update translations
        this.updateTranslations();
    }

    ngOnDestroy() {
        // unsubscribe from config changes
        if (this.configSubscription && !this.configSubscription.closed) {
            this.configSubscription.unsubscribe();
        }

        // unsubscribe from language changes
        if (this.translateSubscription && !this.translateSubscription.closed) {
            this.translateSubscription.unsubscribe();
        }
    }

    translateStrings() {
        // Translate strings
        this.translate.get([
            'FRAME.SETTINGS.TITLE',
            'FRAME.SETTINGS.LANGUAGE.LANGUAGES.ENGLISH',
            'FRAME.SETTINGS.LANGUAGE.LANGUAGES.CHINESE',
            'FRAME.SETTINGS.DARKTHEME.LABEL'
        ]).subscribe((res: string) => {
            this.drawerHeader = res['FRAME.SETTINGS.TITLE'];
            this.lang_en = res['FRAME.SETTINGS.LANGUAGE.LANGUAGES.ENGLISH'];
            this.lang_zh = res['FRAME.SETTINGS.LANGUAGE.LANGUAGES.CHINESE'];
            this.darkThemeLabel = res['FRAME.SETTINGS.DARKTHEME.LABEL'];

            // Now do stuff with the translated strings
            this.createLangList();
        });
    }

    onConfigChange(newConfig: any) {
        // Do something on config change
    }

    createLangList() {
        // Create list of languages
        this.languages = [
            { code: 'en', label: this.lang_en},
            { code: 'zh', label: this.lang_zh}
        ];
    }

    setDarkTheme(applyDark: boolean) {
        // Convert to config properties and send them to the WufConfigurationService
        this.configService.config = {
            themeDark: applyDark
        };
    }

    onDarkThemeChange(val) {
        this.setDarkTheme(val);
    }

    updateTranslations() {
        this.translateStrings();
        this.updateSelectorLanguage();
    }

    updateSelectorLanguage() {
        // Update the selection list to show the currently selected language
        for (let i = 0; i < this.languages.length; i++) {
            if (this.languages[i].code === this.translate.currentLang) {
                this.currentLanguage = this.languages[i];
                break;
            }
        }
    }

    onLanguageChange($event: any) {
        // Language has changed.  Now update the display.
        this.updateTranslations();
    }

    onLanguageSelectionChange($event: any) {
        const newLangCode = this.currentLanguage['code'];
        this.translate.use(newLangCode);

        // set new language in config
        this.configService.config = { language: newLangCode }; // NOTE: This will only persist until there is a page reload as the server config will always override user config in local storage

        // TODO: send the language value back to the server so it can be persisted
    }

    openDrawer() {
        this.drawerService.show('settingsDrawer');
    }

}
