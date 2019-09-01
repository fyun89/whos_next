/*
 * Copyright (c) 2018 Dematic, Corp.
 * Licensed under the MIT Open Source: https://opensource.org/licenses/MIT
 */

import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';

import { dematerialize, delay, materialize, mergeMap } from 'rxjs/operators';
// The following is used to simulate a backend in a static application without one.
// Read this article for more information:
// http://jasonwatmore.com/post/2017/12/15/angular-5-mock-backend-example-for-backendless-development
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Results } from '../../../../server/models/results';
import { deepMerge } from '@anviltech/wuf-ang-utils';

// Get fake data
import { appDefaultConfig } from '../configuration/configuration';
import { FakeUser } from '../../../../server/data/user';


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    simulatedDelay = 0; // Delay, in milliseconds, used to simulate network latency.  This will ALSO delay the pass-through of real API
    // requests to the BFF.  Use with care.
    users: any[] = [];
    storageKey: string = appDefaultConfig.id + '_users';

    constructor() {
        // Get array of users from local storage for registered users
        this.users = JSON.parse(localStorage.getItem(this.storageKey)) || [];

        // If there are no users in local storage, create a default user
        if (!this.users.length) {
            this.createUser(FakeUser);
        }
    }

    createUser(newUser: any) {
        // save new user
        this.users.push(newUser);
        localStorage.setItem(this.storageKey, JSON.stringify(this.users));

        // respond 200 OK
        return observableOf(new HttpResponse({status: 200}));
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        // wrap in delayed observable to simulate server api call
        return observableOf(null).pipe(mergeMap(() => {

                /***** Authentication *****/
                if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
                    // find if any user matches login credentials
                    const filteredUsers = this.users.filter(user => {
                        return user.username === request.body.username && user.password === request.body.password;
                    });

                    if (filteredUsers.length) {
                        // if login details are valid return 200 OK with user details and fake jwt token
                        const user = filteredUsers[0];
                        const data = {
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            token: 'fake-jwt-token'
                            // we do not return password
                        };

                        const results: Results = {
                            info: 'Retrieved user from fake backend',
                            success: true,
                            data: data
                        };

                        return observableOf(new HttpResponse({status: 200, body: results}));
                    } else {
                        // else return 400 bad request
                        return observableThrowError('Username or password is incorrect');
                    }
                }

                /***** USERS *****/
                // get all users
                if (request.url.endsWith('/api/users') && request.method === 'GET') {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real
                    // application

                    const results: Results = {
                        info: 'Retrieved users from fake backend',
                        success: true,
                        data: this.users
                    };

                    if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        return observableOf(new HttpResponse({status: 200, body: results}));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        return observableThrowError('Unauthorized');
                    }
                }

                // get user by id
                if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'GET') {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real
                    // application
                    if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        const urlParts = request.url.split('/');
                        const id = parseInt(urlParts[urlParts.length - 1]);
                        const matchedUsers = this.users.filter(matchedUser => {
                            return matchedUser.id === id;
                        });
                        const user = matchedUsers.length ? matchedUsers[0] : null;
                        const results: Results = {
                            info: 'Retrieved user from fake backend',
                            success: true,
                            data: user
                        };

                        return observableOf(new HttpResponse({status: 200, body: results}));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        return observableThrowError('Unauthorized');
                    }
                }

                // create user
                if (request.url.endsWith('/api/users') && request.method === 'POST') {
                    // get new user object from post body
                    const newUser = request.body;

                    // validation
                    const duplicateUser = this.users.filter(user => {
                        return user.username === newUser.username;
                    }).length;
                    if (duplicateUser) {
                        return observableThrowError('Username "' + newUser.username + '" is already taken');
                    }

                    return this.createUser(request.body);
                }

                // update user
                if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'POST') {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real
                    // application
                    if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        const urlParts = request.url.split('/');
                        const id = parseInt(urlParts[urlParts.length - 1]);
                        for (let i = 0; i < this.users.length; i++) {
                            let user = this.users[i];
                            if (user.id === id) {
                                // update user
                                user = deepMerge(user, request.body); // merge old data with new data
                                localStorage.setItem(this.storageKey, JSON.stringify(this.users));
                                break;
                            }
                        }

                        // respond 200 OK
                        return observableOf(new HttpResponse({status: 200}));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        return observableThrowError('Unauthorized');
                    }
                }

                // delete user
                if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'DELETE') {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real
                    // application
                    if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        const urlParts = request.url.split('/');
                        const id = parseInt(urlParts[urlParts.length - 1]);
                        for (let i = 0; i < this.users.length; i++) {
                            const user = this.users[i];
                            if (user.id === id) {
                                // delete user
                                this.users.splice(i, 1);
                                localStorage.setItem(this.storageKey, JSON.stringify(this.users));
                                break;
                            }
                        }

                        // respond 200 OK
                        return observableOf(new HttpResponse({status: 200}));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        return observableThrowError('Unauthorized');
                    }
                }

                /***** PASS THROUGH *****/
                // Any requests not handled above are passed through and sent to the BFF
                return next.handle(request);
            }),

            // call materialize and dematerialize to ensure delay even if an error is thrown
            // (https://github.com/Reactive-Extensions/RxJS/issues/648)
            materialize(),
            delay(this.simulatedDelay),
            dematerialize());
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
