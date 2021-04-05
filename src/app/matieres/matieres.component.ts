import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';
import { MatieresService } from '../shared/matieres.service';
import { SnackbarService } from '../shared/snackbar.service';
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
  backendUrl = environment.backendBaseUrl;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private matieresService: MatieresService,
    private cdref: ChangeDetectorRef,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private authService: AuthService) { }

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
      }, responseError => {
        this.snackbarService.openSnackbar(responseError.error.message, true);
        this.authService.tokenError(responseError);
      })
    }, responseError => {
      this.snackbarService.openSnackbar(responseError.error.message, true);
      this.authService.tokenError(responseError);
    })
  }

  onClickAdd() {
    const ref = this.dialog.open(AddMatiereComponent, {
      width: '600px',
      data: { matiere: null }
    });
    ref.componentInstance.onUpdate.subscribe(() => {
      this.loadData();
    }, responseError => {
      this.snackbarService.openSnackbar(responseError.error.message, true);
      this.authService.tokenError(responseError);
    })
  }

  onDelete(id: string) {
    this.matieresService.delete(id).subscribe((response) => {
      this.loadData()
      this.snackbarService.openSnackbar(response.message, false);
    }, responseError => {
      this.snackbarService.openSnackbar(responseError.error.message, true);
      this.authService.tokenError(responseError);
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
        catchError((err) => {
          this.authService.tokenError(err);
          this.snackbarService.openSnackbar(err.error.message, true);
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
    this.cdref.detectChanges();
  }

}

