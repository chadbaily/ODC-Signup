import { Component, OnInit, Input } from '@angular/core';
import { UserProfile } from '../dataAccess.service';

@Component({
  selector: 'app-person-display',
  templateUrl: './person-display.component.html'
})
export class PersonDisplayComponent implements OnInit {
  @Input() person: UserProfile;

  constructor() {}

  ngOnInit() {}
}
