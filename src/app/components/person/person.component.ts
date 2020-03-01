import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { PersonService } from '../../services/person.service';
import { Person } from '../../model/person';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  person: Person;

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.personService.get(params.id).subscribe(person => this.person = person);
    });
  }

}
