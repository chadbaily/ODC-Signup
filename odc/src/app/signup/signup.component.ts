import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Time } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare let paypal: any;

export interface User {
  firstName: string;
  lastName: string;
  gender: string;
  student: string;
  dob: Date;
  email: string;
  password: string;
  street: string;
  city: string;
  zip: string;
  phoneNumber: string;
  Membership: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit, AfterViewChecked {
  constructor(private _formBuilder: FormBuilder, private router: Router) {}

  value = '';
  hide = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  public data: User;

  addScript = false;
  paypalLoad = true;

  finalAmount = 1;

  paypalConfig = {
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
            { amount: { total: this.finalAmount, currency: 'USD' } }
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then(payment => {
        this.router.navigate(['thank-you']);
      });
    }
  };

  genders = [
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' }
  ];

  studentOptions = [
    { value: 'yes', viewValue: 'Yes' },
    { value: 'no', viewValue: 'No' }
  ];

  memberships = [
    { value: '30', viewValue: 'Semester (5-Month) Membership ($30)' },
    { value: '50', viewValue: 'Yearly (12-month) Membership ($50)' }
  ];

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
      firstName: this.secondFormGroup.get('firstName').value,
      lastName: this.secondFormGroup.get('lastName').value,
      gender: this.secondFormGroup.get('gender').value,
      student: this.secondFormGroup.get('student').value,
      dob: this.secondFormGroup.get('birthDate').value,
      email: this.firstFormGroup.get('email').value,
      password: this.firstFormGroup.get('password').value,
      street: this.secondFormGroup.get('street').value,
      city: this.secondFormGroup.get('city').value,
      zip: this.secondFormGroup.get('zip').value,
      phoneNumber: this.secondFormGroup.get('phoneNumber').value,
      Membership: this.fourthFormGroup.get('plan').value
    };
  }

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
}
