import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Membership {
  type: string;
  pricePaid: number;
}

export interface UserProfile {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: Date;
  uvaStudent: boolean;
  addrStreet: string;
  addrCity: string;
  addrZip: number;
  phoneNumber: string;
  hasAgreedToWaiver: boolean;
  agreedToWaiverTime: Date;
  membershipType: Membership;
  isActiveOnWeb?: boolean;
}

@Injectable()
export class DataAccessService {
  constructor() {}

  private _userProfile$: BehaviorSubject<UserProfile>;
  get userProfile$(): BehaviorSubject<UserProfile> {
    return this._userProfile$;
  }

  // get API() {
  //   if (isDevMode()) {
  //     return 'http://localhost:8080/api';
  //   }
  //   return 'mongodb://heroku_glcxhfxx:d7h8ToStop@ds257981.mlab.com:57981/heroku_glcxhfxx';
  // }
}
