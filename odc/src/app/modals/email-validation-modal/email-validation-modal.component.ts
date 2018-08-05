import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-email-validation-modal',
  templateUrl: 'email-validation-modal.component.html'
})
export class EmailValidationModalComponent implements OnInit {
  public get data(): string {
    return this._data;
  }
  public set data(value: string) {
    this._data = value;
  }
  constructor(
    public dialogRef: MatDialogRef<EmailValidationModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private _data: string
  ) {}

  ngOnInit() {}
}
