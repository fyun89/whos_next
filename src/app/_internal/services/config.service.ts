/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

// The user service contains a standard set of CRUD methods for managing config.

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class ConfigService {

    constructor(private http: HttpClient) {
    }

    get() {
        // There is no need to include a user ID in this request as the backend will extract user id from the request header
        return this.http.get<any>('/api/config');
    }
}
