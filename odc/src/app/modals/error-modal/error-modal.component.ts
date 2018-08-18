import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface ErrorContent {
  status: string;
  message: string;
}

export interface Error {
  error: ErrorContent;
}

@Component({
  selector: 'app-error-modal',
  templateUrl: 'error-modal.component.html'
})
export class ErrorModalComponent implements OnInit {
  public get data(): string {
    return this._data;
  }
  public set data(value: string) {
    this._data = value;
  }
  constructor(
    public dialogRef: MatDialogRef<ErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: string
  ) {}

  ngOnInit() {}
}
