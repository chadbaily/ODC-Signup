import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Membership } from '../dataAccess.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html'
})
export class ActivateComponent implements OnInit {
  // Link to our api, pointing to localhost
  API = 'http://localhost:3000';

  // Declare empty list of people
  people: any = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllPeople();
  }
  // Get all users from the API
  getAllPeople() {
    this.http.get(`${this.API}/users`).subscribe(people => {
      console.log(people);
      this.people = people;
    });
  }
}
