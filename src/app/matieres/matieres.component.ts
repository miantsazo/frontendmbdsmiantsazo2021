import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Matiere } from '../matiere.model';
import { MatieresService } from '../shared/matieres.service';
import { AddMatiereComponent } from './add-matiere/add-matiere.component';

@Component({
  selector: 'app-matieres',
  templateUrl: './matieres.component.html',
  styleUrls: ['./matieres.component.css']
})
export class MatieresComponent implements AfterViewInit {

  displayedColumns: string[] = ['number', 'libellé', 'prof', 'actions'];
  filteredAndPagedIssues: Observable<any>;

  resultsLength = 0;
  limit = 10;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private matieresService: MatieresService,
    private cdref: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog) { }

  ngAfterViewInit() {
    this.loadData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  onClickEdit(id: string) {
    this.matieresService.getMatiere(id).subscribe((matiere) => {
      const ref = this.dialog.open(AddMatiereComponent, {
        width: '600px',
        data: { matiere }
      });
      ref.componentInstance.onUpdate.subscribe(() => {
        this.loadData();
      })
    })
  }

  onClickAdd() {
    const ref = this.dialog.open(AddMatiereComponent, {
      width: '600px',
      data: { matiere: null }
    });
    ref.componentInstance.onUpdate.subscribe(() => {
      this.loadData();
    })
  }

  onDelete(id: string) {
    this.matieresService.delete(id).subscribe((response) => {
      this.snackBar.open(response.message, null, {
        duration: 500,
        panelClass: ['succes-snackbar']
      }).afterDismissed().subscribe(() => this.loadData())
    }, responseError => {
      this.snackBar.open(responseError.error.message, null, {
        duration: 1000,
        panelClass: ['error-snackbar']
      });
    });
  }

  loadData() {
    this.isLoadingResults = true;
    this.filteredAndPagedIssues = merge(this.paginator.page)
      .pipe(startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.matieresService.getMatieresPagines(this.paginator.pageIndex, this.limit);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.totalDocs;
          return data.docs;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
    this.cdref.detectChanges();
  }

}

