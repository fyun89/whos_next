/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

// The user service contains a standard set of CRUD methods for managing users.

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class UserService {

    constructor(private http: HttpClient) {
    }

    authenticate(user: any) {
        return this.http.post<any>('/api/authenticate', user);
    }

    getAll() {
        return this.http.get<any>('/api/users');
    }

    getById(id: string) {
        return this.http.get<any>('/api/users/' + id);
    }

    create(data: any) {
        return this.http.post<any>('/api/users', data);
    }

    update(data: any) {
        return this.http.put<any>('/api/users/' + data._id, data);
    }

    delete(id: string) {
        return this.http.delete<any>('/api/users/' + id);
    }
}
