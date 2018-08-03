import { Component, OnInit, Input, Host } from '@angular/core';
import { UserProfile, DataAccessService } from '../dataAccess.service';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { ActivateComponent } from '../activate/activate.component';
import { MatDialog } from '../../../node_modules/@angular/material';
import { DeleteUserModalComponent } from '../delete-user-modal/delete-user-modal.component';

@Component({
  selector: 'app-person-display',
  templateUrl: './person-display.component.html'
})
export class PersonDisplayComponent implements OnInit {
  @Input() person: UserProfile;
  // private API = this.dataAccess.API;

  constructor(
    private http: HttpClient,
    private dataAccess: DataAccessService,
    @Host() private parent: ActivateComponent,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  activate() {
    this.http
      .post('/api/activate', this.person)
      .subscribe(() => console.log('Person created!'));
    this.parent.getAllPeople();
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteUserModalComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed: ', result);
      if (result) {
        this.http
          .post('/api/deleteUser', this.person)
          .subscribe(() => console.log('Person deleted'));
        this.parent.getAllPeople();
      }
    });
  }
}
