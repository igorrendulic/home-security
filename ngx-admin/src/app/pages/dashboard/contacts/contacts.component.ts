import { Component, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { Contacts, RecentUsers, UserData } from '../../../@core/data/users';

@Component({
  selector: 'ngx-contacts',
  styleUrls: ['./contacts.component.scss'],
  templateUrl: './contacts.component.html',
})
export class ContactsComponent implements OnDestroy {

  private alive = true;

  contacts: any[];
  recent: any[];

  pageSize = 10;

  constructor(private userService: UserData) {
    forkJoin(
      this.userService.getContacts(),
      this.userService.getRecentUsers(),
    )
      .pipe(takeWhile(() => this.alive))
      .subscribe(([contacts, recent]: [Contacts[], RecentUsers[]]) => {
        this.contacts = contacts;
        this.recent = recent;
      });
  }

  loadNext(cardData) {
    if (cardData.loading) { return; }

    cardData.loading = true;
    cardData.placeholders = new Array(this.pageSize);
  //   this.userService.load(cardData.pageToLoadNext, this.pageSize)
  //     .subscribe(nextNews => {
  //       cardData.placeholders = [];
  //       cardData.news.push(...nextNews);
  //       cardData.loading = false;
  //       cardData.pageToLoadNext++;
  //     });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
