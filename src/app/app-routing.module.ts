import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BarComponent} from './bar/bar.component';
import {QuestionComponent} from './question/question.component';
import {QuestionsComponent} from './questions/questions.component';
import {NewQuestionComponent} from './new-question/new-question.component';
import {LoginComponent} from './login/login.component';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {RegisterComponent} from './register/register.component';
import {RestaurantComponent} from './restaurant/restaurant.component';
import {ComposeReviewComponent} from './compose-review/compose-review.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'compose/:id', component: ComposeReviewComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'restaurant/:id', component: RestaurantComponent},
  {path: '', component: LandingPageComponent},
  {path: 'example_with_id/:id', component: BarComponent},
  {path: 'questions', component: QuestionsComponent},
  {path: 'questions/new', component: NewQuestionComponent},
  {path: 'question/:id', component: QuestionComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {enableTracing: false, onSameUrlNavigation: 'reload'})
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
