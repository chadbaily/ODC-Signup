import { Component, OnInit, Input, Host } from '@angular/core';
import { UserProfile } from '../dataAccess.service';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { Router } from '../../../node_modules/@angular/router';
import { ActivateComponent } from '../activate/activate.component';

@Component({
  selector: 'app-person-display',
  templateUrl: './person-display.component.html'
})
export class PersonDisplayComponent implements OnInit {
  @Input() person: UserProfile;
  private API = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Host() private parent: ActivateComponent
  ) {}

  ngOnInit() {}

  delete() {
    this.http
      .post(`${this.API}/deleteUser`, this.person)
      .subscribe(() => console.log('Person deleted'));
    this.parent.getAllPeople();
  }
}
