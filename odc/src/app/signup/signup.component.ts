import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  constructor(private _formBuilder: FormBuilder) {}

  value = '';
  hide = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  genders = [
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' }
  ];

  studentOptions = [
    { value: 'yes', viewValue: 'Yes' },
    { value: 'no', viewValue: 'No' }
  ];

  memberships = [
    { value: 'semester', viewValue: 'Semester (5-Month) Membership ($30)' },
    { value: 'year', viewValue: 'Yearly (12-month) Membership ($50)' }
  ];

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      student: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      waiver: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      plan: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.fourthFormGroup.valid) {
      console.log('Form Submitted!');
    }
  }
}
