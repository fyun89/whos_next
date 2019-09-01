/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

export const NavigationItems =
    {
        'links': [
            {
                'link': '/',
                'label': 'Page 1',
                'icon': '&#xE88A;',
                'id': 'nav-example-page-1',
                'i18nKey': 'FRAME.NAVIGATION.PAGE1'
            },
            {
                'link': '/example-page-2',
                'label': 'Page 2',
                'icon': '&#xE42B;',
                'id': 'nav-example-page-2',
                'i18nKey': 'FRAME.NAVIGATION.PAGE2'
            },
            {
                'link': '/example-feature-module',
                'label': 'Sub Module',
                'icon': '&#xE875;',
                'id': 'nav-feature-module',
                'i18nKey': 'FRAME.NAVIGATION.FEATUREMODULE.MAIN',
                'links': [
                    {
                        'link': '/example-feature-module/feature-module-page-1',
                        'label': 'Child Page 1',
                        'icon': '&#xE87C;',
                        'id': 'nav-feature-module-child-1',
                        'i18nKey': 'FRAME.NAVIGATION.FEATUREMODULE.PAGE1'
                    },
                    {
                        'link': '/example-feature-module/feature-module-page-2',
                        'label': 'Child Page 2',
                        'icon': '&#xE87C;',
                        'id': 'nav-feature-module-child-2',
                        'i18nKey': 'FRAME.NAVIGATION.FEATUREMODULE.PAGE2'
                    }
                ]
            }
        ]
    };
