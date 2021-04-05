import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prof } from 'src/app/prof.model';
import { AuthService } from 'src/app/shared/auth.service';
import { ProfsService } from 'src/app/shared/profs.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { ProfsComponent } from '../profs.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-add-profs',
  templateUrl: './add-profs.component.html',
  styleUrls: ['./add-profs.component.css']
})
export class AddProfsComponent implements OnInit {
  prof: Prof;
  preview: string;
  profForm: FormGroup;
  onUpdate = new EventEmitter();
  backendUrl = environment.backendBaseUrl;


  constructor(public dialogRef: MatDialogRef<ProfsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private profService: ProfsService,
    private snackbarService: SnackbarService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.profForm = new FormGroup({
      nom: new FormControl(null, [Validators.required]),
      prenom: new FormControl(null, [Validators.required]),
      photo: new FormControl(null),
    });
    this.prof = this.data.prof !== null ? this.data.prof : new Prof();
  }

  confirm() {
    if (this.profForm.invalid) {
      return;
    }
    if (this.prof._id) {
      let updatedProf = { ... this.prof };
      this.profService.update(updatedProf, this.profForm.get('photo').value != null ? this.profForm.get('photo').value._files[0] : null)
        .subscribe(response => {
          this.snackbarService.openSnackbar(response.message, false);
          this.onUpdate.emit('update');
          this.dialogRef.close();
        }, responseError => {
          this.snackbarService.openSnackbar(responseError.error.message, true);
          if (responseError.status === 401) {
            this.dialogRef.close();
          }
          this.authService.tokenError(responseError);
        })
    } else {
      this.profService.add(this.prof, this.profForm.get('photo').value._files[0]).subscribe(response => {
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
