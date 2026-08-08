import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbCarouselModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GalleryComponent } from './components/common/gallery.component';
import { LastWatchedComponent } from './components/last-watched/last-watched.component';
import { PersonComponent } from './components/person/person.component';
import { SearchComponent } from './components/search/search.component';
import { ShowComponent } from "./components/show/show.component";
import { TagsComponent } from './components/tags/tags.component';
import { TopPeopleComponent } from './components/top-people/top-people.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    AppComponent,
    TagsComponent,
    ShowComponent,
    SearchComponent,
    PersonComponent,
    GalleryComponent,
    LastWatchedComponent,
    TopPeopleComponent
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    NgbCarouselModule,
    NgbDropdownModule,
    BrowserAnimationsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
