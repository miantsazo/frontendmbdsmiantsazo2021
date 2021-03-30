import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatieresService } from '../shared/matieres.service';

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

  constructor(private matieresService: MatieresService) { }

  ngAfterViewInit() {
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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

}

