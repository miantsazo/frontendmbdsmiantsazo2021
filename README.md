# AssignmentApp

Ce repository contient les codes sources de l'application front-end qui comprendra :
- une page de login pour accéder à l'application
- une page d'inscription si vous n'avez pas encore de compte
- Un menu pour gérer les assignments
- Un menu pour gérer les matières
- Un menu pour gérer les profs

# Général 
Utilisation de JWT pour la gestion de l'authentification

# Menu Assignments
Deux onglets contenant respectivement :
- Une liste paginée des assignments rendus
- Une liste paginée des assignments non rendus
- Une recherche par rapport au nom de l'assignment

Ajout d'un assignment via un Stepper en 3 étapes
- Etape 1 : informations sur le devoir
- Etape 2 : rendu
- Etpae 3 : confirmation des données

Détails d'un assignment en cliquant sur un élément de la liste
- Rendre un devoir en cochant rendu et en donnant une note à l'élève

Suppression d'un assignment

# Menu Matières
- Liste des matières dans un mat-table
- Ajout d'une nouvelle matière via un popup. La liste des professeurs sera récupérée dans la base et affichée dans un choice list
- Supression d'une matière

# Menu Profs
- Liste des profs dans un mat-table
- Ajout d'un nouveau prof via un popup. Upload de l'image du professeur
- Suppression d'un prof
-   Un prof lié à une matière ne peut être supprimé
