import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { GetErrorMessage } from 'src/app/utils/value-control';
import { AssignmentDetailComponent } from '../assignment-detail/assignment-detail.component';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.css']
})
export class NoteDialogComponent implements OnInit {

  assignment: Assignment;
  noteForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AssignmentDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private assignmentsService: AssignmentsService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.assignment = this.data.assignment;
    this.noteForm = new FormGroup({
      date: new FormControl(null, [Validators.required]),
      note: new FormControl(null, [Validators.required, Validators.max(20), Validators.min(0)]),
      remarques: new FormControl(null, []),
    })
  }

  confirm() {
    if (this.noteForm.invalid) {
      return;
    }
    this.assignment.dateDeRendu = this.noteForm.get('date').value;
    this.assignment.note = this.noteForm.get('note').value;
    this.assignment.remarques = this.noteForm.get('remarques').value;
    this.assignmentsService.updateAssignment(this.assignment).subscribe(response => {
      this.snackBar.open(response.message, null, {
        duration: 1000,
        panelClass: ['success-snackbar']
      });
      this.dialogRef.close();
    }, responseError => {
      this.snackBar.open(responseError.error.message, null, {
        duration: 1000,
        panelClass: ['error-snackbar']
      });
    })
  }

  getErrorMessages(field: string, type: any) {
    return GetErrorMessage(field, type);
  }

}
