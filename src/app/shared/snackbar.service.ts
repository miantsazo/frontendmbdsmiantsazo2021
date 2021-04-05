import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }

  openSnackbar(message, isError): MatSnackBarRef<TextOnlySnackBar>{
    return this.snackbar.open(message, null, {
      duration: 1000,
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}
