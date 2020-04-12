import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Movie } from 'src/app/model/movie';
import { Show } from '../../model/show';
import { Tag } from '../../model/tag';
import { ShowService } from '../../services/show.service';
import { TagService } from '../../services/tag.service';



@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

  show: Show;

  tags: Tag[];

  directionGalleryData: Object;

  castGalleryData: Object;

  similarGalleryData: Object;

  recommendationGalleryData: Object;

  youtubeLink: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private showService: ShowService,
    private tagService: TagService
  ) { }

  ngOnInit() {
    this.tagService.list().subscribe(tags => this.tags = tags);

    this.showService.listShowsWithTags().subscribe(shows => {
      this.route.params.subscribe(params => {
        this.showService.get(params.id, params.type).subscribe(show => {
          this.show = show;

          if (this.show.youtubeId) {
            this.youtubeLink = this.domSanitizer.bypassSecurityTrustResourceUrl(this.show.youtubeId);
          }

          this.directionGalleryData = {
            mode: 'person',
            display: 'scroll',
            shows: shows,
            items: this.show.directions.map(direction => ({
              name: direction.personName,
              link: `/person/${direction.personId}`,
              picture: direction.picture
            }))
          };

          this.castGalleryData = {
            mode: 'person',
            display: 'scroll',
            shows: shows,
            items: this.show.casts.map(cast => ({
              name: cast.personName,
              character: cast.character,
              link: `/person/${cast.personId}`,
              picture: cast.picture
            }))
          };

          this.similarGalleryData = {
            mode: 'show',
            display: 'scroll',
            shows: shows,
            items: this.show.similars.map(show => ({
              showId: show.id,
              showType: this.show.type,
              link: `/show/${this.show.type === Movie.TYPE ? 'M' : 'S'}/${show.id}`,
              picture: show.picture,
              name: show.title,
              rating: show.rating,
              releaseYear: show.releaseYear
            }))
          };

          this.recommendationGalleryData = {
            mode: 'show',
            display: 'scroll',
            shows: shows,
            items: this.show.recommendations.map(show => ({
              showId: show.id,
              showType: this.show.type,
              link: `/show/${this.show.type === Movie.TYPE ? 'M' : 'S'}/${show.id}`,
              picture: show.picture,
              name: show.title,
              rating: show.rating,
              releaseYear: show.releaseYear
            }))
          };
        });
      });
    });
  }

  save(): Observable<Object> {
    return new Observable<Object>(observer => {
      this.showService.save(this.show).subscribe(show => {
        this.show = show;
        observer.next();
      });
    });
  }

  toggleTag(tagId: string): void {
    this.save().subscribe(() => {
      if (this.show.tags.includes(tagId)) {
        this.tagService.untagShow(this.show.id, this.show.type, tagId).subscribe(() =>
          this.show.tags.splice(this.show.tags.indexOf(tagId), 1));
      } else {
        this.tagService.tagShow(this.show.id, this.show.type, tagId).subscribe(() =>
          this.show.tags.push(tagId));
      }
    });
  }

  toggleWatched(): void {
    this.save().subscribe(() => {
      this.showService.toggleWatched(this.show).subscribe(show => this.show = show);
    });
  }

  getTag(tagId: string): Tag {
    return this.tags.find(t => t.id === tagId);
  }

}
