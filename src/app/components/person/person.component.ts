import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '../../model/person';
import { PersonService } from '../../services/person.service';


@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  person: Person;

  directionGalleryData: Object;

  castGalleryData: Object;

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.personService.get(params.id).subscribe(person => {
        this.person = person;

        this.directionGalleryData = {
          mode: 'show',
          display: 'scroll',
          items: this.person.directions.map(direction => ({
            showId: direction.showId,
            showType: direction.showType,
            link: `/show/${direction.isMovie ? 'M' : 'S'}/${direction.showId}`,
            picture: direction.picture,
            name: direction.title,
            rating: direction.rating,
            releaseYear: direction.releaseYear
          }))
        };

        this.castGalleryData = {
          mode: 'show',
          display: 'scroll',
          items: this.person.casts.map(cast => ({
            showId: cast.showId,
            showType: cast.showType,
            link: `/show/${cast.isMovie ? 'M' : 'S'}/${cast.showId}`,
            picture: cast.picture,
            name: cast.title,
            rating: cast.rating,
            releaseYear: cast.releaseYear
          }))
        };
      });
    });
  }

}
