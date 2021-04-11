import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from '../shared/assignments.service';
import { AuthService } from '../shared/auth.service';
import { SnackbarService } from '../shared/snackbar.service';
import { Assignment } from './assignment.model';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  assignments: Assignment[];
  page: number = 1;
  limit: number = 10;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  prevPage: number;
  hasNextPage: boolean;
  nextPage: number;
  renduTab: boolean = false;
  backendUrl = environment.backendBaseUrl;

  // on injecte le service de gestion des assignments
  constructor(private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    // on regarde s'il y a page= et limit = dans l'URL
    this.route.queryParams.subscribe(queryParams => {
      this.page = +queryParams.page || 1;
      this.limit = +queryParams.limit || 10;

      this.getAssignments(this.renduTab);
      this.spinner.hide();
    });


  }

  getAssignments(rendu: boolean) {
    this.spinner.show();
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit, rendu)
      .subscribe(data => {
        this.assignments = data.docs;
        this.page = data.page;
        this.limit = data.limit;
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.hasPrevPage = data.hasPrevPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.nextPage = data.nextPage;
      }, responseError => {
        this.authService.tokenError(responseError);
        this.snackbarService.openSnackbar(responseError.error.message, true);
      });
  }

  premierePage() {
    this.router.navigate(['/home'], {
      queryParams: {
        page: 1,
        limit: this.limit,
        rendu: this.renduTab
      }
    });
  }

  pageSuivante() {
    this.router.navigate(['/home'], {
      queryParams: {
        page: this.nextPage,
        limit: this.limit,
        rendu: this.renduTab
      }
    });
  }


  pagePrecedente() {
    this.router.navigate(['/home'], {
      queryParams: {
        page: this.prevPage,
        limit: this.limit,
        rendu: this.renduTab
      }
    });
  }

  dernierePage() {
    this.router.navigate(['/home'], {
      queryParams: {
        page: this.totalPages,
        limit: this.limit,
        rendu: this.renduTab
      }
    });
  }

  onTabClick(event) {
    this.spinner.show();
    if (event.index == 0) {
      this.renduTab = false
    } else {
      this.renduTab = true
    }
    this.getAssignments(this.renduTab);
    this.spinner.hide();
  }

  applyFilter(name: string) {
   this.assignmentsService.searchAssignments(name, this.renduTab).subscribe(data => {
    this.assignments = data.docs;
  }, responseError => {
    this.authService.tokenError(responseError);
    this.snackbarService.openSnackbar(responseError.error.message, true);
  });
  }
}
