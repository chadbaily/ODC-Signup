import { Component, OnInit, AfterViewChecked, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatStepper } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EmailValidationModalComponent } from '../modals/email-validation-modal/email-validation-modal.component';

interface ErrorContent {
  status: string;
  message: string;
}

interface Error {
  error: ErrorContent;
}

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html'
})
export class StepOneComponent implements OnInit {
  public hide = true;
  public firstFormGroup: FormGroup;

  // tslint:disable-next-line:max-line-length
  private emailRegex: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gim;

  @Input() stepper: MatStepper;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
      password: [null, Validators.required]
    });
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
}
