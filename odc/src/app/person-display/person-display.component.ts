import { Component, OnInit, Input, Host } from '@angular/core';
import { UserProfile, DataAccessService } from '../dataAccess.service';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { ActivateComponent } from '../activate/activate.component';
import { MatDialog } from '../../../node_modules/@angular/material';
import { DeleteUserModalComponent } from '../modals/delete-user-modal/delete-user-modal.component';

interface BrokenPhoneNumber {
  areaCode: string;
  exchange: string;
  number: string;
}

@Component({
  selector: 'app-person-display',
  templateUrl: './person-display.component.html'
})
export class PersonDisplayComponent implements OnInit {
  @Input()
  person: UserProfile;
  // private API = this.dataAccess.API;

  constructor(
    private http: HttpClient,
    private dataAccess: DataAccessService,
    @Host() private parent: ActivateComponent,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  activate() {
    const personPayload = this.convertPerson(this.person);
    this.http
      .post('/api/activate', this.person)
      .subscribe(() => console.log('Person created!', personPayload));
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

  private convertPerson(data: UserProfile): string {
    const phoneNumber = this.breakPhoneNumber(data.phoneNumber);
    const membershipType = this.determineMembershipType(
      data.membershipType.type
    );
    const newPerson =
      // tslint:disable-next-line:max-line-length
      'form-name=' +
      '&firstName=' +
      data.firstName +
      '&lastName=' +
      data.lastName +
      '&gender=' +
      data.gender +
      '&student=' +
      data.uvaStudent +
      '&dob=' +
      data.birthDate +
      '&emailAddress=' +
      data.email +
      '&confirmEmailAddress=' +
      data.email +
      '&password1=' +
      data.password +
      '&password2=' +
      data.password +
      '&street=' +
      data.addrStreet +
      '&city=' +
      data.addrCity +
      '&state=' +
      data.addrState +
      '&zip=' +
      data.addrZip +
      '&areaCode=' +
      phoneNumber.areaCode +
      '&exchange=' +
      phoneNumber.exchange +
      '&number=' +
      phoneNumber.number +
      '&phoneNumberType=1' +
      '&membership-plan=' +
      membershipType;
    return newPerson;
  }

  private breakPhoneNumber(phoneNumber: string) {
    const phoneNum: BrokenPhoneNumber = {
      areaCode: phoneNumber.substring(0, 3),
      exchange: phoneNumber.substring(3, 6),
      number: phoneNumber.substring(6)
    };
    return phoneNum;
  }

  private determineMembershipType(type: string): string {
    return type === '30' ? '18' : '19';
  }
}
