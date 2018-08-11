import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserProfile } from '../dataAccess.service';

declare let paypal: any;

@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.component.html'
})
export class StepFourComponent implements OnInit, AfterViewChecked {
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
        // TODO: FIX ME
        // this.createDataModel();
        this.http
          .post('/api/users', this.data)
          .subscribe(() => console.log('Added User!'));
        this.router.navigate(['thank-you']);
      });
    }
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

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

  /* private createDataModel() {
    this.data = {
      email: this.firstFormGroup.get('email').value,
      password: this.firstFormGroup.get('password').value,
      firstName: this.secondFormGroup.get('firstName').value,
      lastName: this.secondFormGroup.get('lastName').value,
      gender: this.secondFormGroup.get('gender').value,
      birthDate: this.secondFormGroup.get('birthDate').value,
      uvaStudent: this.secondFormGroup.get('student').value,
      addrStreet: this.secondFormGroup.get('street').value,
      addrCity: this.secondFormGroup.get('city').value,
      addrZip: this.secondFormGroup.get('zip').value,
      addrState: this.secondFormGroup.get('state').value,
      phoneNumber: this.secondFormGroup.get('phoneNumber').value,
      hasAgreedToWaiver: this.thirdFormGroup.get('waiver').value,
      agreedToWaiverTime: new Date(),
      membershipType: {
        pricePaid: this.fourthFormGroup.get('plan').value,
        type: this.determineMembershipPrice()
      },
      isActiveOnWeb: false
    };
  } */
}
