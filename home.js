const unableToFind = document.getElementById("unableToFindParent");
const SearchBtn = document.getElementById("SearchBtn");
const searchForm = document.querySelector("form");
const searchInput = document.querySelector("#search");
const resultsList = document.querySelector("#results");
const options = document.querySelectorAll(".options");
const SearchInputValue = document.getElementById("search");
const loading = document.getElementById("loading");

SearchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchRecipes();
});

searchInput.addEventListener("click", () => {
  loading.style.display = "none";
  unableToFind.style.display = "none";
});

options.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    SearchInputValue.value += e.target.innerText + ", ";
  });
});

async function searchRecipes() {
  loading.style.display = "block";
  const searchValue = searchInput.value.trim();
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

  if (html == "") {
    resultsList.innerHTML = "";
    loading.style.display = "none";
    unableToFind.style.display = "flex";
  } else {
    resultsList.innerHTML = html;
    unableToFind.style.display = "none";
  }
}
