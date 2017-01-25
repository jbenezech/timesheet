import { inject, singleton } from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
@singleton()
export class RouteLoader {

    cache = new Map();

    constructor(httpClient) {
        this.http = httpClient;
    }

    invalidateCache() {
        this.cache.clear();
    }

    load(route, parentRoute, parentId, bypassCache) {

        if (! route) {
            return new Promise((resolve) => {});
        }

        if (parentRoute && ! parentId) {
            return new Promise((resolve) => {});
        }

        if (parentId) {
            if (Array.isArray(parentId)) {
                route = route + '?';
                parentId.forEach(function (value) {
                    route += parentRoute + '[]=' + value + '&';
                });
            } else {
                route = parentRoute + '/' + parentId + '/' + route;
            }
        }

        let loader = this;

        if (!bypassCache && this.cache.has(route)) {
            return new Promise((resolve) => {
                resolve(loader.cache.get(route));
            });
        }

        return this.http.fetch(route)
        .then(response => response.json())
        .then(entities => {
            loader.cache.set(route, entities);
            return entities;
        })
    }

}