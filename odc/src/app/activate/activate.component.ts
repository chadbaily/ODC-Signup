import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from '../dataAccess.service';

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
  private API = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllPeople();
  }
  // Get all users from the API
  getAllPeople() {
    this.http.get(`${this.API}/users`).subscribe(people => {
      this.people.next(<UserProfile>people);
      console.log(this.people.getValue());
    });
  }
}
