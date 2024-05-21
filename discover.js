const unableToFind = document.getElementById("unableToFindParent");
const SearchBtn = document.getElementById("SearchBtn");
const searchForm = document.querySelector("form");
const searchInput = document.querySelector("#search");
const resultsList = document.querySelector("#resultsDiscover");
const SearchInputValue = document.getElementById("search");
const loading = document.getElementById("loading");

async function searchRecipes() {
  loading.style.display = "block";
  let x = Math.random() * 80;
  let num = parseInt(x);
  const listOfIngredients = [
    "potato",
    "onion",
    "tomato",
    "cucumber",
    "cabbage",
    "cauliflower",
    "mushroom",
    "sweetcorn",
    "Carrot",
    "Potato",
    "Tomato",
    "Onion",
    "Lettuce",
    "Capsicum",
    "Cucumber",
    "Spinach",
    "Broccoli",
    "Cauliflower",
    "Apple",
    "Banana",
    "Orange",
    "Strawberry",
    "Grapes",
    "Watermelon",
    "Pineapple",
    "Mango",
    "Kiwi",
    "Peach",
    "Cabbage",
    "Cauliflower",
    "Broccoli",
    "Brussels Sprouts",
    "Green Beans",
    "Peas",
    "Corn",
    "Sweet Potato",
    "Pumpkin",
    "Squash",
    "Zucchini",
    "Bell Pepper",
    "Celery",
    "Cucumber",
    "Radish",
    "Beetroot",
    "Carrot",
    "Onion",
    "Garlic",
    "Lettuce",
    "Spinach",
    "Kale",
    "Mushroom",
    "Tomato",
    "Eggplant",
    "Asparagus",
    "Artichoke",
    "Chili Pepper",
    "Potato",
    "Turnip",
    "Leek",
    "Scallion (Green Onion)",
    "Romaine Lettuce",
    "Arugula",
    "Bok Choy",
    "Fennel",
    "Cilantro (Coriander)",
    "Parsley",
    "Watercress",
    "Chard",
    "Endive",
    "Radish",
    "Jalapeno",
    "Ginger",
    "Horseradish",
    "Mustard Greens",
    "Radicchio",
    "Swiss Chard",
    "Turmeric",
    "Yuca (Cassava)",
  ];
  const ingredient = listOfIngredients[num];
  const searchValue = ingredient;
  const response = await fetch(
    `https://api.edamam.com/search?q=${searchValue}&app_id=25f0e56c&app_key=90f9b6aa90dc7b4ae2fe6315691848b9&from=0&to=30`
  );
  const data = await response.json();

  loading.style.display = "none";

  displayRecipes(data.hits);
}

function displayRecipes(recipes) {
  let html = "";
  recipes.forEach((recipe) => {
    html += `
          <div>
              <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
              <h3>${recipe.recipe.label}</h3>
              <ul>
                  ${recipe.recipe.ingredientLines
                    .map((ingredient) => `<li>${ingredient}</li>`)
                    .join("")}
              </ul>
              <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
              
          </div> 
          `;
  });

  resultsList.innerHTML += html;
}

searchRecipes();
