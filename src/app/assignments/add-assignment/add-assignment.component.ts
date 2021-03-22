import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Matiere } from 'src/app/matiere.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { MatieresService } from 'src/app/shared/matieres.service';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
  // Pour les champs du formulaire
  nom = '';
  dateDeRendu = null;

  formGroup: FormGroup;

  errorMessage = "Champs obligatoire";

  assignment: Assignment = null;

  matieres: Matiere[];

  /** Returns a FormArray with the name 'formArray'. */
  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(private assignmentsService: AssignmentsService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private matieresService: MatieresService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.assignment = new Assignment();
    this.assignment.rendu = false;
    this.formGroup = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this._formBuilder.group({
          assignmentName: ['', Validators.required],
          matiere: ['', Validators.required],
        }),
        this._formBuilder.group({
          studentName: ['', Validators.required],
          note: [''],
          dateDeRendu: [''],
          remarque: [''],
        }),
      ])
    });
    this.getMatieres();
  }

  getMatieres() {
    this.matieresService.getMatieres().subscribe(matieres => {
      this.matieres = matieres;
    })
  }

  onSubmit(event) {
    if (this.assignment.dateDeRendu !== null && this.assignment.note != null) {
      this.assignment.rendu = true;
    }

    this.assignmentsService.addAssignment(this.assignment)
      .subscribe(response => {
        this.snackBar.open(response.message, null, {
          duration: 500,
          panelClass: ['success-snackbar']
        }).afterDismissed().subscribe(() => this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/add']);
        }));
      }, responseError => {
        this.snackBar.open(responseError.error.message, null, {
          duration: 1000,
          panelClass: ['error-snackbar']
        });
      });
  }
}
