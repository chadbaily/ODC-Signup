import { Component, OnInit, AfterViewChecked, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatStepper } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DataAccessService } from '../dataAccess.service';
import {
  ErrorModalComponent,
  Error
} from '../modals/error-modal/error-modal.component';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html'
})
export class StepOneComponent implements OnInit {
  public hide = true;
  public firstFormGroup: FormGroup;

  // tslint:disable-next-line:max-line-length
  private emailRegex: RegExp = /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/gim;

  @Input()
  stepper: MatStepper;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dataAccess: DataAccessService
  ) {}

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
      password: [null, Validators.required]
    });
  }

  submit() {
    this.dataAccess.userProfile$.next({
      email: this.firstFormGroup.get('email').value,
      password: this.firstFormGroup.get('password').value,
      firstName: null,
      lastName: null,
      gender: null,
      birthDate: null,
      uvaStudent: null,
      addrStreet: null,
      addrCity: null,
      addrZip: null,
      addrState: null,
      phoneNumber: null,
      hasAgreedToWaiver: null,
      agreedToWaiverTime: null,
      membershipType: {
        pricePaid: null,
        type: null
      },
      isActiveOnWeb: false
    });
  }

  checkEmail(stepper: MatStepper) {
    const email = this.firstFormGroup.get('email').value;
    // console.log('Email: ', email);
    this.http.post('/api/check-email', { email }).subscribe(result => {
      if (result) {
        if (result.hasOwnProperty('error')) {
          const errorResult = result as Error;
          this.dialog.open(ErrorModalComponent, {
            width: '250px',
            data: errorResult.error.message
          });
        } else {
          this.submit();
          stepper.next();
        }
      } else {
        this.submit();
        stepper.next();
      }
    });
  }
}
