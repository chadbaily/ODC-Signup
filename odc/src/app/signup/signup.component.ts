import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html"
})
export class SignupComponent implements OnInit {
  constructor(private _formBuilder: FormBuilder) {}

  value = "";
  hide = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  genders = [
    { value: "male", viewValue: "Male" },
    { value: "female", viewValue: "Female" }
  ];

  studentOptions = [
    { value: "yes", viewValue: "Yes" },
    { value: "no", viewValue: "No" }
  ];

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      birthDate: ["", Validators.required],
      address: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      zip: ["", Validators.required],
    });
  }
}
