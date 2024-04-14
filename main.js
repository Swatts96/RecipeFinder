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

// Function to handle the recipe display with animation
function displayRecipes(recipes) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = ''; // Clear any previous results

    // Loop through the recipes and create elements for each
    recipes.forEach((recipe, index) => {
        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe';
        recipeElement.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" class="animate__animated">
            <a href="https://spoonacular.com/recipes/${recipe.title}-${recipe.id}" target="_blank">View Recipe</a>
        `;
        resultsSection.appendChild(recipeElement);
        
        // Animate each recipe element using GSAP
        gsap.from(recipeElement, {
            duration: 0.5,  // Duration of the animation
            autoAlpha: 0,   // Starts from transparent and fades in
            y: 50,          // Starts 50 pixels down from its final position
            delay: index * 0.1, // Stagger the start of each animation
            ease: 'power1.out' // Smoothing out the animation
        });
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
