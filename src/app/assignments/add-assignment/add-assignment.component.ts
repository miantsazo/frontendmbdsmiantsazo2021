import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Matiere } from 'src/app/matiere.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
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

  constructor(private assignmentsService:AssignmentsService,
              private router:Router,
              private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.assignment = new Assignment();
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
  }

  getMatieres() {

  }

  onSubmit(event) {
    if((!this.nom) || (!this.dateDeRendu)) return;

    let nouvelAssignment = new Assignment();
    nouvelAssignment.nom = this.nom;
    nouvelAssignment.dateDeRendu = this.dateDeRendu;
    nouvelAssignment.rendu = false;

    this.assignmentsService.addAssignment(nouvelAssignment)
      .subscribe(reponse => {
        console.log(reponse.message);

         // et on navigue vers la page d'accueil qui affiche la liste
         this.router.navigate(["/home"]);
      });
  }

}
