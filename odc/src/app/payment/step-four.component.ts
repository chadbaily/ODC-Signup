import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserProfile, DataAccessService } from '../dataAccess.service';
import { ConvertPerson } from '../person-display/convert-person';
import {
  ErrorModalComponent,
  Error
} from '../modals/error-modal/error-modal.component';
import { MatDialog } from '@angular/material';

declare let paypal: any;

@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.component.html'
})
export class StepFourComponent extends ConvertPerson
  implements OnInit, AfterViewChecked {
  public fourthFormGroup: FormGroup;
  public paypalLoad = true;
  public data: UserProfile;

  public memberships = [
    { value: '30', viewValue: 'Semester (5-Month) Membership ($30)' },
    { value: '50', viewValue: 'Yearly (12-month) Membership ($50)' }
  ];
  // private API = this.dataAccess.API;
  private addScript = false;

  private paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox:
        'ASsvtSXZ-ArchEyp6Xc_1NvCwWScYS-Yr9Irf6zksGZC10k3x2WyO_smWlg2rz3DWjN-9GkLiksWyHZ_',
      production:
        'ASaKxdUN0sDGSQGRM8uKeYHsKW0ecsBbqW8mw0rTneq7QECwcCm9bxdV0qKpuSIy-frnkF9eoczgmep8'
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            {
              amount: {
                total: this.fourthFormGroup.get('plan').value,
                currency: 'USD'
              }
            }
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then(payment => {
        this.createDataModel();
        this.http.post('/api/users', this.data).subscribe(() => {
          console.log('Added User!');
          const personPayload: any = {
            converted: this.convertPerson(this.data),
            raw: this.data
          };
          // this.http.post('/api/activate', personPayload).subscribe(result => {
          //   if (result) {
          //     // console.log('Made it into result');
          //     if (result.hasOwnProperty('error')) {
          //       const errorResult = result as Error;
          //       this.dialog.open(ErrorModalComponent, {
          //         width: '250px',
          //         data: errorResult.error.message
          //       });
          //     }
          //     console.log('Hit Activate');
          //   }
          // });
        });
        this.router.navigate(['thank-you']);
      });
    }
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataAccess: DataAccessService,
    public dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.fourthFormGroup = this.formBuilder.group({
      plan: [null, Validators.required]
    });
  }

  ngAfterViewChecked(): void {
    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
        this.paypalLoad = false;
      });
    }
  }

  private addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      const scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    });
  }

  private determineMembershipPrice(): string {
    const membershipPrice = this.fourthFormGroup.get('plan').value;
    if (membershipPrice === '50') {
      return this.memberships[1].viewValue;
    } else {
      // $30 membership
      return this.memberships[0].viewValue;
    }
  }

  private createDataModel() {
    const profile = this.dataAccess.userProfile$.getValue();
    this.data = {
      email: profile.email,
      password: profile.password,
      firstName: profile.firstName,
      lastName: profile.lastName,
      gender: profile.gender,
      birthDate: profile.birthDate,
      uvaStudent: profile.uvaStudent,
      addrStreet: profile.addrStreet,
      addrCity: profile.addrCity,
      addrZip: +profile.addrZip,
      addrState: profile.addrState,
      phoneNumber: profile.phoneNumber,
      hasAgreedToWaiver: profile.hasAgreedToWaiver,
      agreedToWaiverTime: profile.agreedToWaiverTime,
      membershipType: {
        pricePaid: this.fourthFormGroup.get('plan').value,
        type: this.determineMembershipPrice()
      },
      isActiveOnWeb: false
    };
    console.log(this.dataAccess.userProfile$.getValue());
  }
}
