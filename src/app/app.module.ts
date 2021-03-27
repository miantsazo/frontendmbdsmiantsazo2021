import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs'; 
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDialogModule} from '@angular/material/dialog';

import { AssignmentsComponent } from './assignments/assignments.component';
import { RenduDirective } from './shared/rendu.directive';
import { NonRenduDirective } from './shared/non-rendu.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssignmentDetailComponent } from './assignments/assignment-detail/assignment-detail.component';
import { AddAssignmentComponent } from './assignments/add-assignment/add-assignment.component';
import { Routes, RouterModule } from '@angular/router';
import { EditAssigmentComponent } from './assignments/edit-assigment/edit-assigment.component';
import { AuthGuard } from './shared/auth.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { TokenInterceptor } from './shared/token.interceptor';
import { NoteDialogComponent } from './assignments/note-dialog/note-dialog.component';


const routes:Routes = [
  {
    // indique que http://localhost:4200 sans rien ou avec un "/" à la fin
    // doit afficher le composant AssignmentsComponent (celui qui affiche la liste)
    path:"",
    component:LoginComponent
  },
  {
    // idem avec  http://localhost:4200/home
    path:"home",
    component:AssignmentsComponent
  },
  {
    path:"add",
    component:AddAssignmentComponent
  },
  {
    path:"assignment/:id",
    component:AssignmentDetailComponent
  },
  {
    path:"assignment/:id/edit",
    component:AddAssignmentComponent,
    //canActivate : [AuthGuard]
  }
]
@NgModule({
  declarations: [
    AppComponent,
    AssignmentsComponent,
    RenduDirective,
    NonRenduDirective,
    AssignmentDetailComponent,
    AddAssignmentComponent,
    EditAssigmentComponent,
    UsersComponent,
    LoginComponent,
    NoteDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    MatButtonModule, MatDividerModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule,
    MatNativeDateModule, MatListModule, MatCardModule, MatCheckboxModule,
    MatSlideToggleModule, MatTabsModule, MatSnackBarModule, MatStepperModule,
    MatSelectModule, MatGridListModule, MatDialogModule,
    RouterModule.forRoot(routes), HttpClientModule
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi   : true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
