import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { DataAccessService } from '../dataAccess.service';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html'
})
export class StepThreeComponent implements OnInit {
  public thirdFormGroup: FormGroup;

  @Input()
  stepper: MatStepper;

  constructor(
    private formBuilder: FormBuilder,
    private dataAccess: DataAccessService
  ) {}

  submit() {
    const profile = this.dataAccess.userProfile$.getValue();
    this.dataAccess.userProfile$.next({
      email: profile.email,
      password: profile.password,
      firstName: profile.firstName,
      lastName: profile.lastName,
      gender: profile.gender,
      birthDate: profile.birthDate,
      uvaStudent: profile.uvaStudent,
      addrStreet: profile.addrStreet,
      addrCity: profile.addrCity,
      addrZip: profile.addrZip,
      addrState: profile.addrState,
      phoneNumber: profile.phoneNumber,
      hasAgreedToWaiver: this.thirdFormGroup.get('waiver').value,
      agreedToWaiverTime: new Date(),
      membershipType: {
        pricePaid: null,
        type: null
      },
      isActiveOnWeb: false
    });
  }

  ngOnInit() {
    this.thirdFormGroup = this.formBuilder.group({
      waiver: [null, Validators.required]
    });
  }
}
