import { Component, OnInit, Input } from '@angular/core';
import { MatStepper } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as moment from 'moment';

import { DataAccessService } from '../dataAccess.service';
@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class StepTwoComponent implements OnInit {
  public moment = moment;
  public secondFormGroup: FormGroup;
  public genders = [
    { value: 'm', viewValue: 'Male' },
    { value: 'f', viewValue: 'Female' }
  ];

  public studentOptions = [
    { value: '1', viewValue: 'Yes' },
    { value: '0', viewValue: 'No' }
  ];

  public filteredOptions: Observable<string[]>;

  public stateOptions = this.setStates();

  // private birthDateRegex: RegExp = /^(0?[1-9]|1[0-2])[/](0?[1-9]|[12]d|3[01])[/](19|20)d{2}$/;

  @Input()
  stepper: MatStepper;

  constructor(
    private formBuilder: FormBuilder,
    private dataAccess: DataAccessService
  ) {}

  submit() {
    const profile = this.dataAccess.userProfile$.getValue();
    const date = moment(this.secondFormGroup.get('birthDate').value).format(
      'YYYY-MM-DD'
    );
    this.dataAccess.userProfile$.next({
      email: profile.email,
      password: profile.password,
      firstName: this.secondFormGroup.get('firstName').value,
      lastName: this.secondFormGroup.get('lastName').value,
      gender: this.secondFormGroup.get('gender').value,
      birthDate: date,
      uvaStudent: this.secondFormGroup.get('student').value,
      addrStreet: this.secondFormGroup.get('street').value,
      addrCity: this.secondFormGroup.get('city').value,
      addrZip: this.secondFormGroup.get('zip').value,
      addrState: this.secondFormGroup.get('state').value,
      phoneNumber: this.secondFormGroup.get('phoneNumber').value,
      hasAgreedToWaiver: null,
      agreedToWaiverTime: null,
      membershipType: {
        pricePaid: null,
        type: null
      },
      isActiveOnWeb: false
    });
  }

  ngOnInit() {
    this.secondFormGroup = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      gender: [null, Validators.required],
      birthDate: [null, [Validators.required, Validators.maxLength(10)]],
      student: [null, Validators.required],
      street: [null, Validators.required],
      city: [null, Validators.required],
      state: [
        null,
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)]
      ],
      zip: [
        null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)]
      ],
      phoneNumber: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ]
    });
    this.filteredOptions = this.secondFormGroup.get('state').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.secondFormGroup
      .get('birthDate')
      .valueChanges.subscribe(value => console.log(value));
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
