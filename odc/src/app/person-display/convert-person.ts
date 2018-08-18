import { UserProfile } from '../dataAccess.service';

import * as moment from 'moment';

export interface BrokenPhoneNumber {
  areaCode: string;
  exchange: string;
  number: string;
}

export abstract class ConvertPerson {
  public moment = moment;
  constructor() {}

  convertPerson(data: UserProfile): string {
    const phoneNumber = this.breakPhoneNumber(data.phoneNumber);
    const membershipType = this.determineMembershipType(
      data.membershipType.pricePaid
    );
    const newPerson =
      // tslint:disable-next-line:max-line-length
      'form-name=1' +
      '&firstName=' +
      data.firstName +
      '&lastName=' +
      data.lastName +
      '&gender=' +
      data.gender +
      '&student=' +
      data.uvaStudent +
      '&dob=' +
      moment(data.birthDate).format('YYYY-MM-DD') +
      '&emailAddress=' +
      data.email +
      '&confirmEmailAddress=' +
      data.email +
      '&password1=' +
      data.password +
      '&password2=' +
      data.password +
      '&street=' +
      data.addrStreet +
      '&city=' +
      data.addrCity +
      '&state=' +
      data.addrState +
      '&zip=' +
      data.addrZip +
      '&areaCode=' +
      phoneNumber.areaCode +
      '&exchange=' +
      phoneNumber.exchange +
      '&number=' +
      phoneNumber.number +
      '&phoneNumberType=1' +
      '&membership-plan=' +
      membershipType;
    return newPerson;
  }

  breakPhoneNumber(phoneNumber: string) {
    const phoneNum: BrokenPhoneNumber = {
      areaCode: phoneNumber.substring(0, 3),
      exchange: phoneNumber.substring(3, 6),
      number: phoneNumber.substring(6)
    };
    return phoneNum;
  }

  determineMembershipType(type: string): string {
    return type === '30' ? '18' : '19';
  }
}
