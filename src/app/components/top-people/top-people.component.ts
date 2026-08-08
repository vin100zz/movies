import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/model/movie';
import { LightShow } from 'src/app/model/show';
import { ShowService } from '../../services/show.service';

interface PersonStat {
  personId: string;
  personName: string;
  count: number;
  expanded: boolean;
  galleryData: Object;
}

@Component({
  selector: 'app-top-people',
  templateUrl: './top-people.component.html',
  styleUrls: ['./top-people.component.css']
})
export class TopPeopleComponent implements OnInit {

  directors: PersonStat[] = [];
  actors: PersonStat[] = [];

  activeTab: 'directors' | 'actors' = 'directors';

  constructor(private showService: ShowService) { }

  ngOnInit() {
    this.showService.listTopPeople().subscribe((result: any) => {
      this.directors = result.directors.map(dto => this.toPersonStat(dto));
      this.actors = result.actors.map(dto => this.toPersonStat(dto));
    });
  }

  toggle(personStat: PersonStat): void {
    personStat.expanded = !personStat.expanded;
  }

  private toPersonStat(dto: any): PersonStat {
    const shows: LightShow[] = dto.shows.map(showDto => LightShow.fromDto(showDto));

    return {
      personId: dto.personId + '',
      personName: dto.personName,
      count: shows.length,
      expanded: false,
      galleryData: {
        mode: 'show',
        display: 'scroll',
        // No `shows` index passed in: every item here is, by definition,
        // already watched, so the redundant watched badge is skipped.
        items: shows.map(show => ({
          showId: show.id,
          showType: show.type,
          link: `/show/${show.type === Movie.TYPE ? 'M' : 'S'}/${show.id}`,
          picture: show.picture,
          name: show.title,
          rating: show.rating ? Number(show.rating).toFixed(1) : null,
          teleramaRating: show.teleramaRating,
          releaseYear: show.releaseYear,
          duration: show.duration,
          watched: show.watched
        }))
      }
    };
  }

}
