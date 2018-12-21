import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {FooComponent} from './foo/foo.component';
import {BarComponent} from './bar/bar.component';
import {QuestionsComponent} from './questions/questions.component';
import {QuestionComponent} from './question/question.component';
import {NewQuestionComponent} from './new-question/new-question.component';
import {LoginComponent} from './login/login.component';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {RestaurantComponent} from './restaurant/restaurant.component';
import {RegisterComponent} from './register/register.component';
import {RatingComponent} from './rating/rating.component';
import {StarComponent} from './star/star.component';

@NgModule({
  declarations: [
    AppComponent,
    FooComponent,
    BarComponent,
    QuestionsComponent,
    QuestionComponent,
    NewQuestionComponent,
    LoginComponent,
    LandingPageComponent,
    RestaurantComponent,
    RegisterComponent,
    RatingComponent,
    StarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
