const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const recipeContainer = document.getElementById("recipeContainer");

searchBtn.addEventListener("click", () => {
  const recipeName = searchInput.value.trim();

  if (recipeName === "") {
    alert("Please enter a recipe name");
    return;
  }

  fetchRecipe(recipeName);
});

function fetchRecipe(name) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    .then(response => response.json())
    .then(data => {
      if (!data.meals) {
        recipeContainer.innerHTML = "<p>No recipe found 😢</p>";
        return;
      }
      displayRecipe(data.meals[0]);
    })
    .catch(error => {
      recipeContainer.innerHTML = "<p>Error loading recipe</p>";
      console.error(error);
    });
}

function displayRecipe(meal) {
  let ingredientsList = "<ul>";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    }
  }

  ingredientsList += "</ul>";

  recipeContainer.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" width="300">
    <h3>Ingredients</h3>
    ${ingredientsList}
    <h3>Instructions</h3>
    <p>${meal.strInstructions}</p>
  `;
}

