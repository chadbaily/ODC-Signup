import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { ActivateComponent } from './activate/activate.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'activate', component: ActivateComponent },
  { path: 'signup/cash', component: SignupComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
