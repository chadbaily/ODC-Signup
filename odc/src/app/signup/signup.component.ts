import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatStepper } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { UserProfile } from '../dataAccess.service';
import { EmailValidationModalComponent } from '../modals/email-validation-modal/email-validation-modal.component';

declare let paypal: any;

interface ErrorContent {
  status: string;
  message: string;
}

interface Error {
  error: ErrorContent;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  providers: [MatStepper]
})
export class SignupComponent implements OnInit, AfterViewChecked {
  public hide = true;
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public thirdFormGroup: FormGroup;
  public fourthFormGroup: FormGroup;
  public data: UserProfile;
  public paypalLoad = true;
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
  public filteredOptions: Observable<string[]>;

  public stateOptions = this.setStates();

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
        this.http
          .post('/api/users', this.data)
          .subscribe(() => console.log('Added User!'));
        this.router.navigate(['thank-you']);
      });
    }
  };

  // tslint:disable-next-line:max-line-length
  private emailRegex: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gim;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
      password: [null, Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
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
    this.thirdFormGroup = this.formBuilder.group({
      waiver: [null, Validators.required]
    });
    this.fourthFormGroup = this.formBuilder.group({
      plan: [null, Validators.required]
    });

    this.filteredOptions = this.secondFormGroup.get('state').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
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

  checkEmail(stepper: MatStepper) {
    const email = this.firstFormGroup.get('email').value;
    // console.log('Email: ', email);
    this.http.post('/api/check-email', { email }).subscribe(result => {
      // console.log(result);
      if (result) {
        // console.log('Made it into result');
        if (result.hasOwnProperty('error')) {
          const errorResult = result as Error;
          this.dialog.open(EmailValidationModalComponent, {
            width: '250px',
            data: errorResult.error.message
          });
        } else {
          stepper.next();
        }
      } else {
        stepper.next();
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.stateOptions.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private setStates(): string[] {
    return [
      'AL',
      'AK',
      'AZ',
      'AR',
      'CA',
      'CO',
      'CT',
      'DE',
      'FL',
      'GA',
      'HI',
      'ID',
      'IL',
      'IN',
      'IA',
      'KS',
      'KY',
      'LA',
      'ME',
      'MD',
      'MA',
      'MI',
      'MN',
      'MS',
      'MO',
      'MT',
      'NE',
      'NV',
      'NH',
      'NJ',
      'NM',
      'NY',
      'NC',
      'ND',
      'OH',
      'OK',
      'OR',
      'PA',
      'RI',
      'SC',
      'SD',
      'TN',
      'TX',
      'UT',
      'VT',
      'VA',
      'WA',
      'WV',
      'WI',
      'WY',
      'AS',
      'DC',
      'FM',
      'GU',
      'MH',
      'MP',
      'PW',
      'PR',
      'VI',
      'AE',
      'AA',
      'AP'
    ];
  }
}
