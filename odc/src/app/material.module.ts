import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatChipsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatStepperModule,
  MatTableModule,
  MatCheckboxModule,
  MatDialogModule,
  MatAutocompleteModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    MatAutocompleteModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    MatAutocompleteModule
  ]
})
export class MaterialModule {}
