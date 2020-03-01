import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { SerieService } from '../../services/serie.service';
import { Serie } from '../../model/serie';

@Component({
  selector: 'app-serie',
  templateUrl: './serie.component.html',
  styleUrls: ['./serie.component.css']
})
export class SerieComponent implements OnInit {

  serie: Serie;

  constructor(private route: ActivatedRoute, private router: Router, private serieService: SerieService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.serieService.get(params.id).subscribe(serie => this.serie = serie);
    });
  }

  save(): void {
    this.serieService.save(this.serie).subscribe(serie => {
      this.serie = serie;
    });
  }

  toggleWatched(): void {
    /*if (!this.serie.inDb) {
      this.serie.watched = true;
      this.save();
    } else {
      this.serieService.update(this.serie.id, !this.serie.watched, this.serie.toWatch).subscribe(serie => {
        this.serie = serie;
      });
    }*/
  }

  toggleToWatch(): void {
    /*if (!this.serie.inDb) {
      this.serie.toWatch = true;
      this.save();
    } else {
      this.serieService.update(this.serie.id, this.serie.watched, !this.serie.toWatch).subscribe(serie => {
        this.serie = serie;
      });
    }*/
  }

}
