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
  recipeContainer.innerHTML = "<p>Loading recipe...</p>";

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
async function fetchNutrition(ingredient) {
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${ingredient}&search_simple=1&action=process&json=1&page_size=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      return { calories: 0 };
    }

    const nutriments = data.products[0].nutriments || {};

    return {
      calories: nutriments["energy-kcal_100g"] || 0
    };

  } catch (error) {
    console.error("Nutrition error:", error);
    return { calories: 0 };
  }
}

async function displayRecipe(meal) {
  try {

    let ingredients = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        ingredients.push({ name: ingredient, measure });
      }
    }

    const nutritionPromises = ingredients.map(item =>
      fetchNutrition(item.name)
    );

    const nutritionResults = await Promise.all(nutritionPromises);

    let ingredientsList = "<ul>";
    let totalCalories = 0;

    ingredients.forEach((item, index) => {
      const calories = parseFloat(nutritionResults[index].calories) || 0;
      totalCalories += calories;

      ingredientsList += `
        <li>
          ${item.measure} ${item.name}
          <br>
          <small>${calories} kcal</small>
        </li>
      `;
    });

    ingredientsList += "</ul>";

    recipeContainer.innerHTML = `
  <div class="recipe-card">
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}">
    
    <h3>Ingredients</h3>
    ${ingredientsList}

    <div class="nutrition-box">
      <h3>🍎 Nutritional Summary</h3>
      <p><strong>Total Calories:</strong> ${totalCalories.toFixed(2)} kcal</p>
    </div>

    <h3>Instructions</h3>
    <p>${meal.strInstructions}</p>
  </div>
`;


  } catch (error) {
    console.error("Display error:", error);
    recipeContainer.innerHTML = "<p>Error loading nutrition data</p>";
  }
}




