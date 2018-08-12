import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Membership {
  type: string;
  pricePaid: string;
}

export interface UserProfile {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  uvaStudent: boolean;
  addrStreet: string;
  addrCity: string;
  addrZip: number;
  addrState: string;
  phoneNumber: string;
  hasAgreedToWaiver: boolean;
  agreedToWaiverTime: Date;
  membershipType: Membership;
  isActiveOnWeb?: boolean;
}

@Injectable()
export class DataAccessService {
  constructor() {}

  private _userProfile$ = new BehaviorSubject<UserProfile>(null);
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
