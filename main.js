let recipes = [];
let recipesList = [];
let categoryButton = document.querySelectorAll(".category-area button")
let searchButton = document.getElementById("search-button")
let url;
let totalCount = 0;
let currentPage = 1;


//버튼 클릭
categoryButton.forEach(item=>item.addEventListener("click",(event)=>ByCategory(event)));


//레시피 가져오기
const getRecipes = async() => {
  try{

  let header = new Headers({'x-api-key':'d9c140d574c8e323e87a00a286665ad4'});

  url.searchParams.set("from", currentPage)
  url.searchParams.set("to", currentPage+21)
  console.log(url)


  let response = await fetch(url,{headers:header});
  let data = await response.json();

  if(response.status == 200){
    if(data.count == 0 ){
      throw new Error("No matches for your search.")
    }

    recipes = data.hits;
    totalCount = data.count;
    recipesList = [];

    recipes.forEach((item) => {
        recipesList.push(item.recipe);
    });

  render();
  pagination();

  } else {
    throw new Error(error.message);
  }
  } catch(error){
    errorRender(error.message);
  }
}



//레시피 불러오기(메인화면)
const getNewestRecipes = async() =>{
    url = new URL(`https://api.edamam.com/search?q=vegan&app_id=e3cf5ffc&app_key=d9c140d574c8e323e87a00a286665ad4&from=1&to=22`);
    console.log(url);
    
    getRecipes();
}


// 검색하기
const searchByKeyword = async() => {

  let Keyword = document.getElementById("search-input").value
  url = new URL(`https://api.edamam.com/search?q=vegan+${Keyword}&app_id=e3cf5ffc&app_key=d9c140d574c8e323e87a00a286665ad4&from=1&to=22`);

  getRecipes();
  
}

// 카테고리별 보여주기
const ByCategory = async(event) => {
  let category = event.target.textContent.toLowerCase();
  url = new URL(`https://api.edamam.com/search?q=vegan&app_id=e3cf5ffc&app_key=d9c140d574c8e323e87a00a286665ad4&from=1&to=22&dishType=${category}`);

  getRecipes();
}


    
// 화면 보여주기
const render = () => {
    let recipesHTML="";

    recipesHTML = recipesList.map((item) => {
        return `<div class="col">
        <div class="card h-100 shadow-sm">
          <img class="card-img-top" src="${
            item.image == null 
          ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
          : item.image}">
          <div class="card-body card-body-area">
            <div class="card-title-area">
              <h5 class="card-title" style="font-weight: bold">${
                item.label == null
              ? "Unknown"
              : item.label}</h5>
            </div>
            <div class="card-text card-text-area">
                <div class="card-text-info">
                    <span><i class="fa-solid fa-clock"></i> ${
                        item.totalTime <= 0
                        ? "Unknown"
                        : item.totalTime+"min"
                    }</span>
                    <span>
                    <i class="fa-solid fa-fire"></i> ${
                      Math.ceil(item.calories/item.yield) < 0
                      ? "Unknown"
                      : Math.ceil(item.calories/item.yield)+"Kcal/serving"
                      }</span>
                </div>
            </div>
          </div>
        </div>
      </div>`
    }).join('');

    document.getElementById("recipes-board").innerHTML = recipesHTML;
}

//에러 나타내기

const errorRender = (message) => {
  let errorHTML = '';
  errorHTML = `<div class="alert alert-danger text-center error-area w-100" role="alert"> ${message} </div>`
  document.getElementById("recipes-board").innerHTML = errorHTML;
}

// 페이지네이션
// totalCount: 총 데이터의 개수 -> 7000개
// totalPage : 총 페이지 수 -> 
// currentPage : 현재 페이지 -> 1
// pageCount: 화면에 나타날 페이지 개 -> 10개
// limit: 한 페이지 당 나타낼 데이터의 개수 -> 21개
// pageGroup : 페이지 개수 10개 = 페이지 그룹 1개

const pagination = () => {
    let paginationHTML="";

    let pageGroup = Math.ceil(currentPage/10);
    let last = pageGroup*10
    let first = last - 9

    for(let i=first;i<=last;i++){
      paginationHTML += `<li class="page-item ${currentPage==i? "active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }

    document.querySelector(".pagination").innerHTML = paginationHTML; 
}

const moveToPage = (pageNum) => {
  currentPage = pageNum;
  console.log(currentPage)
  getRecipes()
}

searchByKeyword();
ByCategory();
getNewestRecipes();