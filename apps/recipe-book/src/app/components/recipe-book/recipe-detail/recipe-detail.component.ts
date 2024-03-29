import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../../interfaces/recipe.interface';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectRecipeById, selectRecipes } from '../../../store/selectors/recipes.selectors';
import { MatListModule } from '@angular/material/list';
import { Ingredient } from '../../../interfaces/ingredient.interface';
import { ShoppingListActions } from '../../../store/actions/shopping-list.actions';
import { MatDialog } from '@angular/material/dialog';
import { DeleteRecipeDialogComponent } from '../delete-recipe-dialog/delete-recipe-dialog.component';
import { RecipesActions } from '../../../store/actions/recipes.actions';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, MatListModule, RouterModule],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.scss'
})
export class RecipeDetailComponent implements OnInit {

  recipe$!: Observable<Recipe | undefined>;
  recipes$!: Observable<Recipe[]>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const recipeId = params?.['id'];
      if (recipeId) {
        this.recipe$ = this.store.select(selectRecipeById(recipeId));
        this.recipes$ = this.store.select(selectRecipes);
      }
    });
  }

  toShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(ShoppingListActions.addToShoppingList({ ingredients }))
  }

  onDelete(recipeToDelete: Recipe) {
    const dialogRef = this.dialog.open(DeleteRecipeDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recipes$.pipe(take(1)).subscribe((recipes => {
          if(recipes) {
            const updatedRecipes: Recipe[] = recipes.filter(recipe => recipe.id !== recipeToDelete.id);
            this.store.dispatch(RecipesActions.deleteRecipe({ recipe: recipeToDelete, updatedRecipes }))
          }
        }));
      }
    });
  }

}
