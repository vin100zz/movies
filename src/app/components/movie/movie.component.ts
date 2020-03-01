import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { MovieService } from '../../services/movie.service';
import { TagService } from '../../services/tag.service';
import { Movie } from '../../model/movie';
import { Tag } from '../../model/tag';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  movie: Movie;

  tags: Tag[];

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor(private route: ActivatedRoute, private router: Router, private movieService: MovieService, private tagService: TagService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.movieService.get(params.id).subscribe(movie => this.movie = movie);
      this.tagService.list().subscribe(tags => this.tags = tags);
    });
  }

  save(): Observable<Object> {
    return new Observable<Object>(observer => {
      this.movieService.save(this.movie).subscribe(movie => {
        this.movie = movie;
        observer.next();
      });
    });
  }

  switchTag(tagId: string) {
    this.save().subscribe(() => {
      if (this.movie.tags.includes(tagId)) {
        this.tagService.untagShow(this.movie.id, this.movie.type, tagId).subscribe(() =>
          this.movie.tags.splice(this.movie.tags.indexOf(tagId), 1));
      } else {
        this.tagService.tagShow(this.movie.id, this.movie.type, tagId).subscribe(() =>
          this.movie.tags.push(tagId));
      }
    });
  }

  toggleWatched(): void {
    /* if (!this.movie.inDb) {
       this.movie.watched = true;
       this.save();
     } else {
       this.movieService.update(this.movie.id, !this.movie.watched, this.movie.toWatch).subscribe(movie => {
         this.movie = movie;
       });
     }*/
  }

  toggleToWatch(): void {
    /*if (!this.movie.inDb) {
       this.movie.toWatch = true;
      this.save();
    } else {
      this.movieService.update(this.movie.id, this.movie.watched, !this.movie.toWatch).subscribe(movie => {
        this.movie = movie;
      });
    }*/
  }

}
