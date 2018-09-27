import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { User } from '@features/user/User';
import { GET_DONT_BE_A, GetDontBeAQuery } from '@shared/schema/queries';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'bl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  user: User;

  constructor(
    private userService: UserService,
    private router: Router,
    private titleService: Title,
    private apollo: Apollo,
  ) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.apollo.watchQuery<GetDontBeAQuery>({
          query: GET_DONT_BE_A,

        }).valueChanges
        .subscribe(query => {
          const quotes = query.data.allDontBeAs.dontBeAs;
          const randNum = Math.floor(Math.random() * quotes.length);
          titleService.setTitle(quotes[randNum].phrase);
        });
      }
    });
  }

  ngOnInit() {
    this.userService.user.subscribe(user => (this.user = user));
  }
}
