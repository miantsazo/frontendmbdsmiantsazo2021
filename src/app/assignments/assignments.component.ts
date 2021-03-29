import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  assignments:Assignment[];
  page: number=1;
  limit: number=10;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  prevPage: number;
  hasNextPage: boolean;
  nextPage: number;
  renduTab: boolean = false;

  // on injecte le service de gestion des assignments
  constructor(private assignmentsService:AssignmentsService,
              private route:ActivatedRoute,
              private router:Router) {}

  ngOnInit() {
    // on regarde s'il y a page= et limit = dans l'URL
    this.route.queryParams.subscribe(queryParams => {
      this.page = +queryParams.page || 1;
      this.limit = +queryParams.limit || 10;

      this.getAssignments(this.renduTab);
    });
  }

  getAssignments(rendu: boolean) {
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
    });
  }

  onDeleteAssignment(event) {
    // event = l'assignment à supprimer

    //this.assignments.splice(index, 1);
    this.assignmentsService.deleteAssignment(event)
      .subscribe(message => {
        console.log(message);
      })
  }

  premierePage() {
    this.router.navigate(['/home'], {
      queryParams: {
        page:1,
        limit:this.limit,
        rendu: this.renduTab
      }
    });
  }

  pageSuivante() {
    /*
    this.page = this.nextPage;
    this.getAssignments();*/
    this.router.navigate(['/home'], {
      queryParams: {
        page:this.nextPage,
        limit:this.limit,
        rendu: this.renduTab
      }
    });
  }


  pagePrecedente() {
    this.router.navigate(['/home'], {
      queryParams: {
        page:this.prevPage,
        limit:this.limit,
        rendu: this.renduTab
      }
    });
  }

  dernierePage() {
    this.router.navigate(['/home'], {
      queryParams: {
        page:this.totalPages,
        limit:this.limit,
        rendu: this.renduTab
      }
    });
  }

  onTabClick(event) {
    if(event.index == 0) {
      this.renduTab = false
    } else {
      this.renduTab = true
    }
    this.getAssignments(this.renduTab);
  }
}
