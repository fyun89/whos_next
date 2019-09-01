import {NavConfig} from './config-nav';

export interface Config {
    id?:             string;
    name?:           string;
    copyrightName?:  string;
    navigation?:     NavConfig;
    theme?:          string;
}

export default Config;
