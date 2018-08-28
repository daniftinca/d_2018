import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ListBugsComponent} from "./list-bugs/list-bugs.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginguardGuard} from "../authentication/loginguard.guard";
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatTableModule
} from "@angular/material";
import {MatDialogModule} from '@angular/material/dialog';
import {BugsPopupComponent} from "./bugs-popup/bugs-popup.component";
import {MatChipsModule} from '@angular/material/chips';
import {AddBugComponent} from "./add-bug/add-bug.component";
import {MatSelectModule} from '@angular/material/select';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../app.module";
import {HttpClient} from "@angular/common/http";
import {BugsGuard} from "../authentication/bugs.guard";
import {ListBugsPipe} from "./list-bugs/list-bugs-pipe";


const bugRoutes: Routes = [
  {path: 'bugs', component: ListBugsComponent, canActivate: [LoginguardGuard, BugsGuard]},
  // {path: 'add-bug', component: AddBugComponent, canActivate: [LoginguardGuard]}
];

@NgModule({
  imports: [
    TranslateModule.forChild({

      loader: {

        provide: TranslateLoader,

        useFactory: HttpLoaderFactory,

        deps: [HttpClient]

      }

    }),
    CommonModule,
    RouterModule.forChild(bugRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule



  ],
  declarations: [ListBugsComponent, BugsPopupComponent, AddBugComponent, ListBugsPipe],
  exports: [
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDialogModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    ListBugsPipe,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule

  ],
  entryComponents: [
    BugsPopupComponent,
    AddBugComponent
  ]
})
export class BugsModule {
}
