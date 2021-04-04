import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Assignment } from '../assignment.model';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent implements OnInit {
  // passé sous forme d'attribut HTML
  assignmentTransmis: Assignment;

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getAssignmentById();
    this.spinner.hide();
  }

  getAssignmentById() {
    const id: string = this.route.snapshot.params.id;
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignmentTransmis = assignment[0];
    });
  }

  onAssignmentRendu() {
    this.spinner.show();
    this.assignmentTransmis.rendu = true;

    this.assignmentsService
      .updateAssignment(this.assignmentTransmis)
      .subscribe((reponse) => {
        this.spinner.hide();
      });

    //this.assignmentTransmis = null;
  }

  onDelete() {
    this.assignmentsService
      .deleteAssignment(this.assignmentTransmis)
      .subscribe((response) => {
        this.snackBar.open(response.message, null, {
          duration: 500,
          panelClass: ['succes-snackbar']
        }).afterDismissed().subscribe(() => this.router.navigate(['/home']))
      }, responseError => {
        this.snackBar.open(responseError.error.message, null, {
          duration: 1000,
          panelClass: ['error-snackbar']
        });
      });
  }

  onClickEdit() {
    this.router.navigate(['/assignment', this.assignmentTransmis._id, 'edit']);
  }

  isAdmin() {
    return this.authService.admin;
  }

  openDialog(): void {
    this.dialog.open(NoteDialogComponent, {
      width: '400px',
      data: { assignment: this.assignmentTransmis }
    });

  }
}
