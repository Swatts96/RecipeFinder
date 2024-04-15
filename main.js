// Function to fetch ingredients by category
function fetchIngredients(category) {
    // Use the API key in the URL
    let apiUrl = `https://api.spoonacular.com/food/ingredients/${category}?apiKey=${'01090eb8422f4a118390b44a9932c1d8'}`;
    
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
    const numberOfRecipes = 5;
    
    // Construct the API URL
    let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${queryParam}&number=${numberOfRecipes}&sort=random&apiKey=${'01090eb8422f4a118390b44a9932c1d8'}`;
    
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
    resultsSection.classList.add('grid-container'); // Add a class for styling the grid

    // Loop through the recipes and create elements for each
    recipes.forEach((recipe, index) => {
        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe grid-item animate__animated'; // Add Animate.css classes
        // Choose the animation effect you like from Animate.css
        recipeElement.classList.add('animate__fadeInUp');
        recipeElement.style.animationDelay = `${index * 0.2}s`; // Delay the animation of each recipe

        recipeElement.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
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


