// Function to fetch ingredients by category
                                            //Ready for marking
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

    let dragulaContainers = []; // Array to store draggable containers

    recipes.forEach((recipe, index) => {
        // Create and configure the main recipe element
        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe grid-item animate__animated animate__fadeInUp';
        recipeElement.style.animationDelay = `${index * 0.2}s`;
        recipeElement.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
            <a href="https://spoonacular.com/recipes/${recipe.title}-${recipe.id}" target="_blank" class="btn btn-primary">View Recipe</a>
        `;

        // Append the recipeElement to the container
        resultsSection.appendChild(recipeElement);

        // Determine button type based on some logic, for example, alternating button types
        let buttonType = index % 2 === 0 ? 'info' : 'secondary';

        // Create 'View More' button
        const viewMoreBtn = document.createElement('button');
        viewMoreBtn.innerText = 'View More';
        viewMoreBtn.className = `btn btn-${buttonType} view-more-button`;
        viewMoreBtn.setAttribute('data-recipe-id', recipe.id);

        // Append the 'View More' button to the recipe element
        recipeElement.appendChild(viewMoreBtn);

        // Create a container for the details
        const detailsContainer = document.createElement('div');
        detailsContainer.id = `details-${recipe.id}`;
        detailsContainer.className = 'recipe-details-container';
        detailsContainer.style.display = 'none'; // Initially hidden
        recipeElement.appendChild(detailsContainer);

        // Set up the event listener for the 'View More' button
        viewMoreBtn.addEventListener('click', function() {
            const recipeId = this.getAttribute('data-recipe-id');
            const detailsDiv = document.getElementById(`details-${recipeId}`);
            const isVisible = detailsDiv.style.display === 'block';

            // Toggle visibility of details
            detailsDiv.style.display = isVisible ? 'none' : 'block';

            // Fetch details if not already fetched
            if (!isVisible && !detailsDiv.hasAttribute('data-fetched')) {
                fetchAndDisplayRecipeDetails(recipeId, detailsDiv);
                detailsDiv.setAttribute('data-fetched', 'true');
            }
        });

        // Add recipeElement to Dragula's array of containers
        dragulaContainers.push(recipeElement);
    });

    // Initialize Dragula with the array of recipe elements
    dragula(dragulaContainers)
    .on('drag', function(el) {
        // Optional: add a class or style when dragging starts
        el.classList.add('is-moving');
    })
    .on('dragend', function(el) {
        // Optional: clean up any class or style when dragging ends
        el.classList.remove('is-moving');
    })
    .on('drop', function(el, target, source, sibling) {
        // Optional: Handle the drop event
        console.log(`Recipe was moved: ${el.id}`);
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
function fetchAndDisplayRecipeDetails(recipeId, detailsContainer) {
    const detailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=01090eb8422f4a118390b44a9932c1d8`;

    // Check if details are already fetched to avoid redundant API calls
    if (!detailsContainer.hasAttribute('data-fetched')) {
        fetch(detailsUrl)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(details => {
                if (details) {
                    // Display the details in the container
                    displayRecipeDetails(details, detailsContainer);
                    detailsContainer.setAttribute('data-fetched', 'true'); // Mark as fetched
                    detailsContainer.style.display = 'block'; // Make sure to show the details
                }
            })
            .catch(error => {
                console.error('Error fetching recipe details:', error);
                // Handle the error, e.g., by showing an error message
            });
    } else {
        // Toggle visibility if details are already fetched
        detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
    }
}

// Helper function to append recipe details to the details container
function displayRecipeDetails(details, container) {
    container.innerHTML = ''; // Clear previous details if any

    // Append the summary
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'recipe-summary';
    summaryDiv.innerHTML = details.summary || 'No summary available.';
    container.appendChild(summaryDiv);

    // Append the ingredients list
    const ingredientsDiv = document.createElement('div');
    ingredientsDiv.className = 'recipe-ingredients';
    const ingredientsList = document.createElement('ul');
    details.extendedIngredients.forEach(ingredient => {
        const ingredientItem = document.createElement('li');
        ingredientItem.innerHTML = ingredient.original;
        ingredientsList.appendChild(ingredientItem);
    });
    ingredientsDiv.appendChild(ingredientsList);
    container.appendChild(ingredientsDiv);

    // Append the cooking instructions
    if (details.instructions) {
        const instructionsDiv = document.createElement('div');
        instructionsDiv.className = 'recipe-instructions';
        instructionsDiv.innerHTML = details.instructions;
        container.appendChild(instructionsDiv);
    }
}
//Commit
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
