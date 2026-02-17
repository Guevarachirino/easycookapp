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

async function displayRecipe(meal) {
  let ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({ name: ingredient, measure });
    }
  }

  // 🚀 Todas las peticiones al mismo tiempo
  const nutritionPromises = ingredients.map(item =>
    fetchNutrition(item.name)
  );

  const nutritionResults = await Promise.all(nutritionPromises);

  let ingredientsList = "<ul>";

  let totalCalories = 0;

  ingredients.forEach((item, index) => {
    const nutrition = nutritionResults[index];

    const calories = parseFloat(nutrition?.calories) || 0;
    totalCalories += calories;

    ingredientsList += `
      <li>
        ${item.measure} ${item.name}
        <br>
        <small>
          ${calories} kcal
        </small>
      </li>
    `;
  });

  ingredientsList += "</ul>";

  recipeContainer.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" width="300">

    <h3>Ingredients</h3>
    ${ingredientsList}

    <div class="nutrition-box">
      <h3>🍎 Nutritional Summary</h3>
      <p><strong>Total Calories (approx):</strong> ${totalCalories.toFixed(2)} kcal</p>
      <p><small>*Values based on 100g per ingredient*</small></p>
    </div>

    <h3>Instructions</h3>
    <p>${meal.strInstructions}</p>
  `;
}



