import { NgModule, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { environment } from '@environments/environment';
import { Apollo } from 'apollo-angular';

import { HttpHeaders } from '@angular/common/http';
import { setContext } from 'apollo-link-context';
import { AuthResponse } from '@shared/types';

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [],
})
export class GraphQLModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const http = httpLink.create({uri: environment.apiUrl + '/graphql'});

    const auth = setContext((_, { headers }) => {
      let token: AuthResponse;

      if (isPlatformBrowser(this.platformId)) {
        // get the authentication token from local storage if it exists
        token = JSON.parse(window.localStorage.getItem('token'));
      }
      // return the headers to the context so httpLink can read them
      // in this example we assume headers property exists
      // and it is an instance of HttpHeaders
      if (!token || !token.token) {
        return {};
      } else {
        return {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        };
      }
    });

    apollo.create({
      link: auth.concat(http),
      cache: new InMemoryCache(),
      connectToDevTools: true
    });
  }
}
