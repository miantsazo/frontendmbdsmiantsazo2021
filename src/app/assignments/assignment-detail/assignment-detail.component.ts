import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { AuthService } from 'src/app/shared/auth.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
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
    private snackbarService: SnackbarService,
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
    }, responseError => {
      this.snackbarService.openSnackbar(responseError.error.message, true);
      this.authService.tokenError(responseError);
      if(responseError.status === 404) {
        this.snackbarService.openSnackbar(responseError.error.message, true);
        this.router.navigate(['/']);
      }
    });
  }

  onDelete() {
    this.assignmentsService
      .deleteAssignment(this.assignmentTransmis)
      .subscribe((response) => {
        this.snackbarService.openSnackbar(response.message, false).afterDismissed().subscribe(() => this.router.navigate(['/home']))
      }, responseError => {
        this.authService.tokenError(responseError);
        this.snackbarService.openSnackbar(responseError.error.message, false).afterDismissed().subscribe(() => this.router.navigate(['/home']))
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
