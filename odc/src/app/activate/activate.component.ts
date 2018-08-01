import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfile, DataAccessService } from '../dataAccess.service';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html'
})
export class ActivateComponent implements OnInit {
  // Declare empty list of people
  public people = new BehaviorSubject<UserProfile>(null);

  get persons() {
    return this.people.getValue();
  }
  // Link to our api, pointing to localhost

  constructor(
    private http: HttpClient,
    private dataAccess: DataAccessService
  ) {}

  ngOnInit() {
    this.getAllPeople();
  }
  // Get all users from the API
  getAllPeople() {
    this.http.get('/api/users').subscribe(people => {
      this.people.next(<UserProfile>people);
      console.log(this.people.getValue());
    });
  }
}
