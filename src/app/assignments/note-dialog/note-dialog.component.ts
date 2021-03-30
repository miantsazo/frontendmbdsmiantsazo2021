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
    
    let newAssignment = {... this.assignment};
    newAssignment.dateDeRendu = this.noteForm.get('date').value;
    newAssignment.note = this.noteForm.get('note').value;
    newAssignment.remarques = this.noteForm.get('remarques').value;
    newAssignment.matiere = this.assignment.matiere[0]._id;
    newAssignment.prof = this.assignment.prof[0]._id;
    newAssignment.rendu = true;
    this.assignmentsService.updateAssignment(newAssignment).subscribe(response => {
      this.assignment.dateDeRendu = newAssignment.dateDeRendu;
      this.assignment.note = newAssignment.note;
      this.assignment.remarques = newAssignment.remarques;
      this.assignment.rendu = newAssignment.rendu;
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

  get f() { return this.noteForm.controls; }

}
