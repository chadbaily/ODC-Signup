import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html'
})
export class StepThreeComponent implements OnInit {
  public thirdFormGroup: FormGroup;

  @Input() stepper: MatStepper;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.thirdFormGroup = this.formBuilder.group({
      waiver: [null, Validators.required]
    });
  }
}
