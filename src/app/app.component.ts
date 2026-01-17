import { Component } from '@angular/core';
import { ShowService } from './services/show.service';
import { FilterService } from './services/filter.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'movies';
  showTypeFilter: 'M' | 'S' = 'M';

  constructor(
    private showService: ShowService,
    private filterService: FilterService
  ) { }

  onSwitchToggle() {
    this.showTypeFilter = this.showTypeFilter === 'M' ? 'S' : 'M';
    this.filterService.setShowTypeFilter(this.showTypeFilter);
  }

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
