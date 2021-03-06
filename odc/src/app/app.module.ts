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
import { ErrorModalComponent } from './modals/error-modal/error-modal.component';
import { StepOneComponent } from './login/step-one.component';
import { StepTwoComponent } from './address/step-two.component';
import { StepThreeComponent } from './waiver/step-three.component';
import { StepFourComponent } from './payment/step-four.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    ThankYouComponent,
    ActivateComponent,
    PersonDisplayComponent,
    DeleteUserModalComponent,
    ErrorModalComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    PageNotFoundComponent
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
  entryComponents: [DeleteUserModalComponent, ErrorModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
