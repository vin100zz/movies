import { MoviesComponent } from './components/movies/movies.component';
import { PersonComponent } from './components/person/person.component';
import { SearchComponent } from './components/search/search.component';
import { SerieComponent } from './components/serie/serie.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MovieComponent } from './components/movie/movie.component';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    MoviesComponent,
    MovieComponent,
    SerieComponent,
    SearchComponent,
    PersonComponent,
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
