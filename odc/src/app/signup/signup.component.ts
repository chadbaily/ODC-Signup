import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepOneComponent } from '../login/step-one.component';
import { StepTwoComponent } from '../address/step-two.component';
import { StepThreeComponent } from '../waiver/step-three.component';
import { StepFourComponent } from '../payment/step-four.component';

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
  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cdr.detectChanges();
  }
}
