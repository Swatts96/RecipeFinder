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

 