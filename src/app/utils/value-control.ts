import { FormGroup } from '@angular/forms';

/* On a utilisé le tuto du net https://jasonwatmore.com/post/2018/11/07/angular-7-reactive-forms-validation-example 
pour la gestion des erreurs au niveau de confirmation de mot de passe dans l'inscription */

export function MatchPassordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

export function GetErrorMessage(field: string, type: any) {
    if (field === 'username') {
        if (type.required) {
            return 'Nom d\'utilisateur obligatoire';
        } else if (type.minlength) {
            return 'Le nom d\'utilisateur doit comporter au moins 6 caractères';
        } else if (type.onlySpaceDetected) {
            return 'Le nom d\'utilisateur n\'est pas valide ';
        }
    }
    if (field === 'password') {
        if (type.required) {
            return 'Mot de passe obligatoire';
        } else if (type.minlength) {
            return 'Le mot de passe doit comporter au moins 8 caractères';
        } 
    }
    if (field === 'confirmPassword') {
        if (type.mustMatch) {
            return 'Les mots de passe ne sont pas identiques';
        }
    }
    return '';
}

export function NotOnlySpaceValidator(control) {
    if(control.value.trim().length === 0) {
        return {onlySpaceDetected: true}
    }
    return null;
}
