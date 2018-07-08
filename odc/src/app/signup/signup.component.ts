import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Time } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataAccessService, UserProfile } from '../dataAccess.service';
import { HttpClient } from '@angular/common/http';

declare let paypal: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit, AfterViewChecked {
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private dataAccess: DataAccessService,
    private http: HttpClient
  ) {}

  public hide = true;
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public thirdFormGroup: FormGroup;
  public fourthFormGroup: FormGroup;
  public data: UserProfile;
  public paypalLoad = true;

  private API = 'http://localhost:3000';
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
        this.http
          .post(`${this.API}/users`, this.data)
          .subscribe(() => console.log('Added User!'));
        this.router.navigate(['thank-you']);
      });
    }
  };

  public genders = [
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' }
  ];

  public studentOptions = [
    { value: 'yes', viewValue: 'Yes' },
    { value: 'no', viewValue: 'No' }
  ];

  public memberships = [
    { value: '30', viewValue: 'Semester (5-Month) Membership ($30)' },
    { value: '50', viewValue: 'Yearly (12-month) Membership ($50)' }
  ];

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      gender: [null, Validators.required],
      birthDate: [null, Validators.required],
      student: [null, Validators.required],
      street: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      zip: [null, Validators.required],
      phoneNumber: [null, Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      waiver: [null, Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
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

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      const scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    });
  }

  createDataModel() {
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
      phoneNumber: this.secondFormGroup.get('phoneNumber').value,
      hasAgreedToWaiver: this.thirdFormGroup.get('waiver').value,
      agreedToWaiverTime: new Date(),
      membershipType: {
        pricePaid: this.fourthFormGroup.get('plan').value,
        type: this.determineMembershipPrice()
      },
      isActiveOnWeb: false
    };
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
}
