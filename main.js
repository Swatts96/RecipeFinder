// Import the API key from config.js at the top of your file
import { API_KEY } from './config.js';

// Function to fetch ingredients by category
function fetchIngredients(category) {
    // Use the API key in the URL
    let apiUrl = `https://api.spoonacular.com/food/ingredients/${category}?apiKey=${API_KEY}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process the data and create bubble items for ingredients
            createIngredientBubbles(data, category);
        })
        .catch(error => console.error('Error fetching ingredients:', error));
}


// Function to fetch recipes based on ingredients
function fetchRecipesByIngredients(ingredients) {
    // Construct the query parameter from the input
    const queryParam = ingredients.join(',');
    
    // Set the number of recipes to fetch
    const numberOfRecipes = 3;
    
    // Construct the API URL
    let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${queryParam}&number=${numberOfRecipes}&sort=random&apiKey=${API_KEY}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.results); // Process and display the recipes
        })
        .catch(error => console.error('Error fetching recipes:', error));
}

// Function to handle the recipe display
function displayRecipes(recipes) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = ''; // Clear any previous results
    
    // Loop through the recipes and create elements for each
    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe';
        recipeElement.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <a href="https://spoonacular.com/recipes/${recipe.title}-${recipe.id}" target="_blank">View Recipe</a>
        `;
        resultsSection.appendChild(recipeElement);
    });
}



document.getElementById('find-recipes-button').addEventListener('click', () => {
    const ingredientInput = document.getElementById('ingredient-input');
    if (ingredientInput.value.trim() === '') {
        alert('Please enter at least one ingredient.');
        return;
    }
    const ingredients = ingredientInput.value.split(',').map(ing => ing.trim()).filter(ing => ing !== '');
    fetchRecipesByIngredients(ingredients); // Fetch recipes with the inputted ingredients
});
