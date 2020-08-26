import { Component } from '@angular/core';
import { ShowService } from './services/show.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'movies';

  constructor(
    private showService: ShowService
  ) { }

  onResync() {
    this.showService.listShowsWithTags().subscribe(shows => {
      shows.forEach((show, index) => {
        this.showService.getFromTmdb(show.id, show.type).subscribe(updatedShow => {
          window.setTimeout(() => this.showService.resync(updatedShow).subscribe(), index*1000);
        });
      });
    });
  }
}
