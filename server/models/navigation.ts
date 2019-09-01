export interface NavItem {
    link:               string;
    label:              string;
    id?:                string;
    icon?:              string;
    links?:             any;
    activeOptions?:     any;
    // This "index signature" allows the interface to accept any additional unexpected properties without throwing an error.
    // This is necessary because the routes service may use the same data object.
    [propName: string]: any;
}

export interface Navigation {
    links: NavItem[];
}
