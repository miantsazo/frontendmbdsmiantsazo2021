import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, merge, of as observableOf } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';
import { environment } from 'src/environments/environment';
import { ProfsService } from '../shared/profs.service';
import { SnackbarService } from '../shared/snackbar.service';
import { AddProfsComponent } from './add-profs/add-profs.component';


@Component({
  selector: 'app-profs',
  templateUrl: './profs.component.html',
  styleUrls: ['./profs.component.css']
})
export class ProfsComponent implements AfterViewInit {
  backendUrl = environment.backendBaseUrl;
  displayedColumns: string[] = ['number', 'photo', 'nom', 'actions'];
  filteredAndPagedIssues: Observable<any>;

  resultsLength = 0;
  limit = 10;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private profsService: ProfsService,
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
    this.profsService.getProf(id).subscribe((prof) => {
      const ref = this.dialog.open(AddProfsComponent, {
        width: '600px',
        data: { prof }
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
    const ref = this.dialog.open(AddProfsComponent, {
      width: '600px',
      data: { prof: null }
    });
    ref.componentInstance.onUpdate.subscribe(() => {
      this.loadData();
    }, responseError => {
      this.snackbarService.openSnackbar(responseError.error.message, true);
      this.authService.tokenError(responseError);
    })
  }

  onDelete(id: string) {
    this.profsService.delete(id).subscribe((response) => {
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
          return this.profsService.getProfsPagines(this.paginator.pageIndex, this.limit);
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
