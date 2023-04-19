let recipes = [];
let recipesList = [];
let categoryButton = document.querySelectorAll(".category-area button")
let searchButton = document.getElementById("search-button")
let url;


//버튼 클릭
categoryButton.forEach(item=>item.addEventListener("click",(event)=>ByCategory(event)));


//레시피 가져오기

const getRecipes = async() => {
  let header = new Headers({'x-api-key':'d9c140d574c8e323e87a00a286665ad4'});
  let response = await fetch(url,{headers:header});
  let data = await response.json();

  recipes = data.hits;
  recipesList = [];

  recipes.forEach((item) => {
      recipesList.push(item.recipe);
    });

    render()
}


// 검색하기
const searchByKeyword = async() => {

  let Keyword = document.getElementById("search-input").value
  url = new URL(`https://api.edamam.com/search?q=${Keyword}&app_id=e3cf5ffc&app_key=d9c140d574c8e323e87a00a286665ad4&from=0&to=21`);

  getRecipes();
  
}



// 카테고리별 보여주기
const ByCategory = async(event) => {
    event.target.textContent.toLowerCase();
    url = new URL(`https://api.edamam.com/search?q=vegan&app_id=e3cf5ffc&app_key=d9c140d574c8e323e87a00a286665ad4&from=0&to=21&dishType=${categorys}`);
 
  getRecipes();
}


//레시피 불러오기(메인화면)
const getNewestRecipes = async() =>{
    url = new URL(`https://api.edamam.com/search?q=vegan&app_id=e3cf5ffc&app_key=d9c140d574c8e323e87a00a286665ad4&from=0&to=21`);
    getRecipes();
}




    
// 화면 보여주기
const render = () => {
    let recipesHTML="";

    recipesHTML = recipesList.map((item) => {
        return `<div class="col">
        <div class="card h-100 shadow-sm">
          <img src="${item.image}" class="card-img-top">
          <div class="card-body card-body-area">
            <div class="card-title-area">
              <h5 class="card-title" style="font-weight: bold">${item.label}</h5>
            </div>
            <div class="card-text card-text-area">
                <div class="card-text-info">
                    <span><i class="fa-solid fa-clock"></i> ${
                        item.totalTime <= 0
                        ? "Unknown"
                        : item.totalTime+"min"
                    }</span>
                    <span>
                    <i class="fa-solid fa-fire"></i> ${Math.ceil(item.calories/item.yield)}Kcal/serving</span>
                </div>
            </div>
          </div>
        </div>
      </div>`
    }).join('');

    document.getElementById("recipes-board").innerHTML = recipesHTML;
}


searchByKeyword();
ByCategory();
getNewestRecipes();
