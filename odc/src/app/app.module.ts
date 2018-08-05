import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { DataAccessService } from './dataAccess.service';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { ActivateComponent } from './activate/activate.component';
import { PersonDisplayComponent } from './person-display/person-display.component';
import { DeleteUserModalComponent } from './modals/delete-user-modal/delete-user-modal.component';
import { EmailValidationModalComponent } from './modals/email-validation-modal/email-validation-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    ThankYouComponent,
    ActivateComponent,
    PersonDisplayComponent,
    DeleteUserModalComponent,
    EmailValidationModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [DataAccessService],
  entryComponents: [DeleteUserModalComponent, EmailValidationModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
