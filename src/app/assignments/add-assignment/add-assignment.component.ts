import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Matiere } from 'src/app/matiere.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { AuthService } from 'src/app/shared/auth.service';
import { MatieresService } from 'src/app/shared/matieres.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
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

  isEdition = false;

  /** Returns a FormArray with the name 'formArray'. */
  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(private assignmentsService: AssignmentsService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private matieresService: MatieresService,
    private snackbarService: SnackbarService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.assignment = new Assignment();
    if (this.route.snapshot.params.id) {
      this.isEdition = true;
      this.assignmentsService.getAssignment(this.route.snapshot.params.id).subscribe((assignment) => {
        this.assignment = assignment[0];
        this.assignment.matiere = assignment[0].matiere[0];
      }, responseError => {
        this.snackbarService.openSnackbar(responseError.error.message, true);
        this.authService.tokenError(responseError);
      });
    } else {
      this.assignment.rendu = false;
    }
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
    }, responseError => {
      this.snackbarService.openSnackbar(responseError.error.message, true);
      this.authService.tokenError(responseError);
    })
  }

  onSubmit() {
    if (this.isEdition) {
      this.assignmentsService.updateAssignment(this.assignment).subscribe(response => {
        this.snackbarService.openSnackbar(response.message, false);
      }, responseError => {
        this.snackbarService.openSnackbar(responseError.error.message, true);
        this.authService.tokenError(responseError);
      })
    } else {
      if (this.assignment.dateDeRendu !== null && this.assignment.note != null) {
        this.assignment.rendu = true;
      }

      this.assignmentsService.addAssignment(this.assignment)
        .subscribe(response => {
          this.snackbarService.openSnackbar(response.message, false).afterDismissed().subscribe(() => this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/add']);
          }));
        }, responseError => {
          this.snackbarService.openSnackbar(responseError.error.message, true);
          this.authService.tokenError(responseError);
        });
    }

  }

  compareMatiere(matiere1: Matiere, matiere2: Matiere): boolean {
    return matiere1._id == matiere2._id;
  }
}
