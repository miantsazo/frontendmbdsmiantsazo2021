import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Matiere } from 'src/app/matiere.model';
import { Prof } from 'src/app/prof.model';
import { AuthService } from 'src/app/shared/auth.service';
import { MatieresService } from 'src/app/shared/matieres.service';
import { ProfsService } from 'src/app/shared/profs.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { MatieresComponent } from '../matieres.component';

@Component({
  selector: 'app-add-matiere',
  templateUrl: './add-matiere.component.html',
  styleUrls: ['./add-matiere.component.css']
})
export class AddMatiereComponent implements OnInit {

  matiere: Matiere;
  matiereForm: FormGroup;
  profs: Prof[];
  onUpdate = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<MatieresComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private matiereService: MatieresService,
    private profService: ProfsService,
    private snackbarService: SnackbarService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.matiereForm = new FormGroup({
      libelle: new FormControl(null, [Validators.required]),
      prof: new FormControl(null, [Validators.required]),
    });
    this.matiere = this.data.matiere !== null ? this.data.matiere[0] : new Matiere();
    this.getProfs();
  }

  compareProf(prof1: Prof, prof2: Prof): boolean {
    return prof1._id == prof2._id;
  }

  getProfs() {
    this.profService.getProfs().subscribe(profs => {
      this.profs = profs;
    }, responseError => {
      this.snackbarService.openSnackbar(responseError.error.message, true);
      this.authService.tokenError(responseError);
    })
  }

  confirm() {
    if (this.matiereForm.invalid) {
      return;
    }
    if (this.matiere._id) {
      let updatedMatiere = { ... this.matiere };
      updatedMatiere.prof = this.matiere.prof[0]._id;
      this.matiereService.update(updatedMatiere).subscribe(response => {
        this.snackbarService.openSnackbar(response.message, false);
        this.onUpdate.emit('update');
        this.dialogRef.close();
      }, responseError => {
        this.snackbarService.openSnackbar(responseError.error.message, true);
        this.authService.tokenError(responseError);
      })
    } else {
      this.matiere.prof = this.matiereForm.get('prof').value;
      this.matiereService.add(this.matiere).subscribe(response => {
        this.snackbarService.openSnackbar(response.message, false);
        this.onUpdate.emit('update');
        this.dialogRef.close();
      }, responseError => {
        this.snackbarService.openSnackbar(responseError.error.message, true);
        this.authService.tokenError(responseError);
      })
    }

  }

}
