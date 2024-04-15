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
    const numberOfRecipes = 9;
    
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
        recipeElement.classList.add('animate__fadeInUp');
        recipeElement.style.animationDelay = `${index * 0.2}s`; // Delay the animation of each recipe

        recipeElement.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
            <a href="https://spoonacular.com/recipes/${recipe.title}-${recipe.id}" target="_blank">View Recipe</a>
        `;

        resultsSection.appendChild(recipeElement);

        addDetailedInformation(recipe.id, recipeElement);
    });
}


// Function to fetch and add detailed information for each recipe
function addDetailedInformation(recipeId, recipeElement) {
    const detailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=01090eb8422f4a118390b44a9932c1d8`;
  
    fetch(detailsUrl)
      .then(response => response.json())
      .then(details => {
        // Create and append the summary description
        const summaryElement = document.createElement('p');
        summaryElement.className = 'summary-panel';
        summaryElement.innerHTML = details.summary; // This should be the formatted description from the API
        recipeElement.appendChild(summaryElement);
  
        // Create and append the ingredients list
        const ingredientsList = document.createElement('ul');
        ingredientsList.className = 'ingredients-list';
        details.extendedIngredients.forEach(ingredient => {
          const ingredientItem = document.createElement('li');
          ingredientItem.textContent = `${ingredient.original}`;
          ingredientsList.appendChild(ingredientItem);
        });
        recipeElement.appendChild(ingredientsList);
      })
      .catch(error => console.error('Error fetching detailed information:', error));
  }


// Function to fetch and display detailed information for each recipe
function fetchAndDisplayRecipeDetails(recipeId, recipeElement) {
    const detailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=01090eb8422f4a118390b44a9932c1d8`;
  
    fetch(detailsUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(details => {
        // Assuming 'details' is the JSON object returned by the API with the recipe details
        // Now we can display the details such as ingredients and instructions
  
        // For example, append the summary to the recipeElement
        if (details.summary) {
          const summaryDiv = document.createElement('div');
          summaryDiv.className = 'recipe-summary';
          summaryDiv.innerHTML = details.summary;
          recipeElement.appendChild(summaryDiv);
        }
  
        // Append the ingredients list to the recipeElement
        if (details.extendedIngredients) {
          const ingredientsDiv = document.createElement('div');
          ingredientsDiv.className = 'recipe-ingredients';
          const ingredientsList = details.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('');
          ingredientsDiv.innerHTML = `<ul>${ingredientsList}</ul>`;
          recipeElement.appendChild(ingredientsDiv);
        }
  
        // Append the instructions to the recipeElement
        if (details.instructions) {
          const instructionsDiv = document.createElement('div');
          instructionsDiv.className = 'recipe-instructions';
          instructionsDiv.innerHTML = details.instructions;
          recipeElement.appendChild(instructionsDiv);
        }
      })
      .catch(error => {
        console.error('Error fetching recipe details:', error);
        // Handle the error, for example, by showing an error message to the user
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

document.querySelectorAll('.view-more-button').forEach(button => {
    button.addEventListener('click', (event) => {
      const recipeId = event.target.dataset.recipeId; // Make sure to set this data attribute when creating the button
      const recipeElement = document.querySelector(`#recipe-${recipeId}`); // The element where we want to display the details
      fetchAndDisplayRecipeDetails(recipeId, recipeElement);
    });
  });
