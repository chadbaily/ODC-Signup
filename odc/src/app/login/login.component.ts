import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Membership } from '../dataAccess.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  // Link to our api, pointing to localhost
  API = 'http://localhost:3000';

  // Declare empty list of people
  people: any = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllPeople();
  }

  // Add one person to the API
  addPerson(
    email,
    password,
    firstName,
    lastName,
    gender,
    birthDate,
    uvaStudent,
    addrStreet,
    addrCity,
    addrZip,
    phoneNumber,
    hasAggreedToWaiver,
    membership: Membership
  ) {
    this.http
      .post(`${this.API}/users`, {
        email,
        password,
        firstName,
        lastName,
        gender,
        birthDate,
        uvaStudent,
        addrStreet,
        addrCity,
        addrZip,
        phoneNumber,
        hasAggreedToWaiver,
        membership
      })
      .subscribe(() => {
        this.getAllPeople();
      });
  }

  // Get all users from the API
  getAllPeople() {
    this.http.get(`${this.API}/users`).subscribe(people => {
      console.log(people);
      this.people = people;
    });
  }
}
