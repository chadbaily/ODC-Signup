import { Component, OnInit, Input, Host } from '@angular/core';
import { UserProfile, DataAccessService } from '../dataAccess.service';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { ActivateComponent } from '../activate/activate.component';
import { MatDialog } from '../../../node_modules/@angular/material';
import { DeleteUserModalComponent } from '../modals/delete-user-modal/delete-user-modal.component';
import {
  ErrorModalComponent,
  Error
} from '../modals/error-modal/error-modal.component';

import { ConvertPerson } from './convert-person';

@Component({
  selector: 'app-person-display',
  templateUrl: './person-display.component.html'
})
export class PersonDisplayComponent extends ConvertPerson implements OnInit {
  @Input()
  person: UserProfile;
  // private API = this.dataAccess.API;

  constructor(
    private http: HttpClient,
    @Host() private parent: ActivateComponent,
    public dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {}

  activate() {
    const personPayload: any = {
      converted: this.convertPerson(this.person),
      raw: this.person
    };
    this.http
      .post('/api/activate/subscribe', personPayload)
      .subscribe(result => {
        // console.log('Subscribe', result);
        if (result) {
          // console.log('Made it into result');
          if (result.hasOwnProperty('error')) {
            const errorResult = result as Error;
            this.dialog.open(ErrorModalComponent, {
              width: '250px',
              data: errorResult.error.message
            });
          }
        }
        this.http.post('/api/activate', personPayload).subscribe(response => {
          // console.log('Activate', response);
          if (response) {
            // console.log('Made it into result');
            if (response.hasOwnProperty('error')) {
              const errorResult = response as Error;
              this.dialog.open(ErrorModalComponent, {
                width: '250px',
                data: errorResult.error.message
              });
            }
          }
          this.parent.getAllUnactivePeople();
        });
      });
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteUserModalComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post('/api/deleteUser', this.person).subscribe(() => {
          console.log('Person deleted');
          this.parent.getAllUnactivePeople();
        });
      }
    });
  }
}
