// Function to fetch ingredients by category
function fetchIngredients(category) {
    // Use the correct endpoint for fetching categories. This is just an example
    let apiUrl = `https://api.spoonacular.com/food/ingredients/${category}?apiKey=YOUR_API_KEY`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process the data and create bubble items for ingredients
            createIngredientBubbles(data, category);
        })
        .catch(error => console.error('Error fetching ingredients:', error));
}

// Function to create bubble items for ingredients
function createIngredientBubbles(ingredients, category) {
    let container = document.getElementById(category); // Get the container for the category
    container.innerHTML = ''; // Clear any existing content

    ingredients.forEach(ingredient => {
        let bubble = document.createElement('button');
        bubble.className = 'ingredient-bubble';
        bubble.textContent = ingredient.name;
        bubble.onclick = () => toggleIngredientSelection(ingredient);
        container.appendChild(bubble);
    });
}

// Function to handle ingredient selection toggling
function toggleIngredientSelection(ingredient) {
    // Implement the logic for selecting/deselecting ingredients
    console.log('Selected ingredient:', ingredient);
    // Update the UI accordingly
}

// Example call to fetch vegetables
fetchIngredients('vegetables');

 