/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

import { Component, ViewEncapsulation, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { WufConfigurationService } from '@anviltech/wuf-ang-configuration';
import { UserService } from './_internal/services/user.service';
import { ConfigService } from './_internal/services/config.service';
import { deepMerge } from '@anviltech/wuf-ang-utils';
import { TranslateService } from '@ngx-translate/core';

// App configuration
import { appDefaultConfig } from './_internal/configuration/configuration';

// The following imports are only used for demo purposes
import { FakeUser } from '../../server/data/user';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [WufConfigurationService, UserService],
    encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent implements OnInit, OnDestroy {

    config: any = appDefaultConfig;
    configSubscription: Subscription;
    theme: string;
    defaultLang: string = 'en';

    constructor(
        private wufConfigService: WufConfigurationService,
        private renderer: Renderer2,
        private userService: UserService,
        private configService: ConfigService,
        public translate: TranslateService
    ) {
        // This language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang(this.defaultLang);
    }

    ngOnInit() {
        /*
            FAKING LOGIN
            Since this app has no backend, we are not presenting the user with a login screen.
            However, we still need user data in order to create a proper configuration object.
            In order to fake it, we get fake username and password info from the FakeUser object
            of fake-backend.service, which simulates data collection from a login screen.

            Once we have fake username/password we proceed as any production app would and pass this
            info into the UserService's authenticate() method. This method will then send an
            authentication request to '/api/authenticate'.

            We intercept '/api/authenticate' using the fake backend's HttpInterceptor.

            This process will simulate the effect of logging in and then assembling a full configuration object
            which can then be used throughout this application.

            NOTE: The above process happens upon every browser refresh.  Obviously, if this were a
            production application, we would only want to do this process when the user session
            or the user token (if using JWT) has expired.  This app makes no assumptions about (or has
            any opinions on) the login process.
        */

        this.getServerData();

        // Subscribe to configuration updates
        this.configSubscription = this.wufConfigService.onConfigChange().subscribe(
            newConfig => {
                this.onConfigChange(newConfig);
            },
            err => {
                console.warn('error on subscription:', err);
            }
        );
    }

    getServerData() {

        // Get fake login info from FakeUser object of /src/internal/fake-backend/data/user.ts
        const fakeLoginData = {
            username: FakeUser.username,
            password: FakeUser.password
        };

        // Authenticate using fake username/password
        this.userService.authenticate(fakeLoginData).subscribe(
            userData => {
                // Authentication successful.  We now have fake user data.
                const user = userData.data;

                // Get config data
                this.configService.get().subscribe(
                    configData => {

                        const config = configData.success ? configData.data : {};

                        // Set a storage key to get/set config in local storage
                        const appKey = appDefaultConfig.id;
                        const userKey = user.hasOwnProperty('id') ? user.id : user.hasOwnProperty('username') ? user.username : 'default_user';
                        this.wufConfigService.setStorageKey(appKey + '_' + config.tenantKey + '_' + userKey); // set the storage key to use from here on out

                        // Merge user and config data into single config object
                        const mergedConfiguration = this.getMergedConfiguration(user, config);

                        // Send merged configuration data to the config service (which updates the UI accordingly)
                        this.wufConfigService.config = mergedConfiguration;

                        this.setLanguage(mergedConfiguration);
                    }
                );
            },
            error => {
                // error
                console.warn('Error retrieving config from server. Error:', error);
            }
        );

    }

    ngOnDestroy() {
        // unsubscribe from config updates
        if (this.configSubscription && !this.configSubscription.closed) {
            this.configSubscription.unsubscribe();
        }
    }

    setLanguage(config: object) {
        // Set language based on tenant language
        // const browserLang = this.translate.getBrowserLang(); // Not used

        if (!config.hasOwnProperty('language')) {
            return;
        }

        const langToUse: string = config['language'];
        this.translate.use(langToUse ? langToUse : this.defaultLang);
    }

    getMergedConfiguration(userData, configData) {
        /* Create a config object comprised of data from various sources:
            1. If user settings are received from the backend with new attributes or with modified values, use these new/modified values
            2. If no new or modified setting values are received from server, use locally stored setting values
            3. If no local or stored settings values exist, use default application settings pulled from Angular's environment properties
            4. If no default application settings exist in Angular's environment properties, use the default settings baked into the
            application and application components.  Nothing to do here since those properties live in the components themselves.
        */

        // Put user info into a config-like object
        const user = {
            user: userData
        };

        // Get locally stored config, if any, by app id (from local app configuration) + tenant id (from API's config object)
        // + user id (from API's user object)

        const key = this.wufConfigService.getStorageKey();
        const localConfig = this.wufConfigService.getStoredConfig(key);

        return deepMerge(
            {},
            this.config, // start with default app config
            localConfig, // apply config from local storage, if any
            configData, // Now add data from server.  Server data trumps everything above.
            user // User preference data trumps all.
        );

    }

    onConfigChange(newConfig: any) {
        // Received notification of a config update.  Do something with each updated property, if applicable.

        // Apply a theme
        this.applyTheme(newConfig);

        // Apply dark theme
        if (newConfig.hasOwnProperty('themeDark')) {
            this.applyDarkTheme(newConfig.themeDark);
        }

        // Config has already been applied to local storage.  Now send updated config back to server for DB storage.
        // (This is where you should send configuration updates back to the server for server-side persistence)
    }

    applyTheme(newConfig: any) {
        // Fetch the URL of the theme's CSS file from the config and apply it to the DOM.  We are doing this via DOM manipulation because
        // using two-way binding in the template causes the screen to flicker as the attribute is constantly re-evaluatated by Angular.
        const theme = newConfig.theme;

        if (!newConfig.hasOwnProperty('theme') || (newConfig.hasOwnProperty('theme') && theme === this.theme) )  {
            return;
        }

        const nodeId = 'wuf-css-theme';
        const link = document.getElementById(nodeId);

        if (!theme || !theme.length) {
            if (link) {
                link.remove();
            }
        }
        else if (theme && theme.length && link) {
            link['href'] = theme;
        }
        else {
            // Create a new link
            const node = document.createElement('link');
            node.href = theme;
            node.rel = 'stylesheet';
            node.id = 'css-theme';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

        // Set wuf-has-theme to true so loading screen turns off
        this.renderer.setAttribute(document.documentElement, 'wuf-has-theme', 'true');
    }

    applyDarkTheme(applyDark: boolean) {
        if (!applyDark) {
            // Remove the 'wuf-theme-dark' property, if no longer applicable
            this.renderer.removeAttribute(document.documentElement, 'wuf-theme-dark');
        }
        else if (applyDark) {
            // Set the 'wuf-theme-dark' property on the <html> element.
            this.renderer.setAttribute(document.documentElement, 'wuf-theme-dark', 'true');
        }
    }

}
