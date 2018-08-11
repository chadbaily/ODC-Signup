import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { StepOneComponent } from '../step-one/step-one.component';
import { StepTwoComponent } from '../step-two/step-two.component';
import { StepThreeComponent } from '../step-three/step-three.component';
import { StepFourComponent } from '../step-four/step-four.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  get firstFormGroup(): FormGroup {
    return this.stepOneComponent ? this.stepOneComponent.firstFormGroup : null;
  }
  get secondFormGroup(): FormGroup {
    return this.stepTwoComponent ? this.stepTwoComponent.secondFormGroup : null;
  }
  get thirdFormGroup(): FormGroup {
    return this.stepThreeComponent
      ? this.stepThreeComponent.thirdFormGroup
      : null;
  }
  get fourthFormGroup(): FormGroup {
    return this.stepFourComponent
      ? this.stepFourComponent.fourthFormGroup
      : null;
  }

  @ViewChild(StepOneComponent) stepOneComponent: StepOneComponent;
  @ViewChild(StepTwoComponent) stepTwoComponent: StepTwoComponent;
  @ViewChild(StepThreeComponent) stepThreeComponent: StepThreeComponent;
  @ViewChild(StepFourComponent) stepFourComponent: StepFourComponent;

  constructor() {}

  ngOnInit() {}
}
