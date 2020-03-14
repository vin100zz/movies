import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowService } from 'src/app/services/show.service';
import { Person } from '../../model/person';
import { PersonService } from '../../services/person.service';


@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  person: Person;

  shows: Object[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService, private showService: ShowService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.personService.get(params.id).subscribe(person => {
        this.person = person;
      });
      this.showService.listShowsWithTags().subscribe(shows => {
        this.shows = shows;
      });
    });
  }

  getPosterMark(showId: string, showType: string): string {
    let show = this.shows.find(x => x['id'] === showId && x['type'] === showType);
    if (show) {
      if (show['watched'] === 'true') {
        return 'watched';
      }
      if (show['tags'].length) {
        return 'tagged';
      }
    }
    return '';
  }

}
