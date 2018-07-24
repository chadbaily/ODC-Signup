import { Component, OnInit, Input, Host } from '@angular/core';
import { UserProfile } from '../dataAccess.service';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { Router } from '../../../node_modules/@angular/router';
import { ActivateComponent } from '../activate/activate.component';
import { MatDialog } from '../../../node_modules/@angular/material';
import { DeleteUserModalComponent } from '../delete-user-modal/delete-user-modal.component';

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
    @Host() private parent: ActivateComponent,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  delete() {
    const dialogRef = this.dialog.open(DeleteUserModalComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed: ', result);
      if (result) {
        this.http
          .post(`${this.API}/deleteUser`, this.person)
          .subscribe(() => console.log('Person deleted'));
        this.parent.getAllPeople();
      }
    });
  }
}
