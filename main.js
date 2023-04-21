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

  if(currentPage == 1) {
    url.searchParams.set("from", 1)
    url.searchParams.set("to", 31)
  } else if (currentPage == 226) {
    url.searchParams.set("from", (currentPage*31)-30)
    url.searchParams.set("to", 7000)
  }
    else if(currentPage > 1) {
    url.searchParams.set("from", (currentPage*31)-30)
    url.searchParams.set("to", currentPage*31)
  }
  

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



//메인화면
const getMainPage = async() =>{
    url = new URL(`https://api.edamam.com/search?q=vegan&app_id=e3cf5ffc&app_key=d9c140d574c8e323e87a00a286665ad4&from=1&to=31`);
    
    getRecipes();
}


// 검색하기
const searchByKeyword = async() => {

  let Keyword = document.getElementById("search-input").value
  url = new URL(`https://api.edamam.com/search?q=vegan+${Keyword}&app_id=e3cf5ffc&app_key=d9c140d574c8e323e87a00a286665ad4&from=1&to=31`);

  getRecipes();
  
}

// 카테고리별 보여주기
const ByCategory = async(event) => {
  let category = event.target.textContent.toLowerCase();
  url = new URL(`https://api.edamam.com/search?q=vegan&app_id=e3cf5ffc&app_key=d9c140d574c8e323e87a00a286665ad4&from=1&to=31&dishType=${category}`);

  getRecipes();
}


    
// 화면 보여주기
const render = () => {
    let recipesHTML="";

    recipesHTML = recipesList.map((item) => {
        return `<div class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-img-box">
            <img class="card-img-top card-img" src="${
              item.image == null 
            ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
            : item.image}">
          </div>
          <div class="card-body card-body-area">
            <div class="card-title-area">
              <a href ="${item.url}" target="_blank"><h5 class="card-title" style="font-weight: bold">${
                item.label == null
              ? "Unknown"
              : item.label}</h5></a>
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
// limit: 한 페이지 당 나타낼 데이터의 개수 -> 31개
// pageGroup : 페이지 개수 10개 = 페이지 그룹 1개

const pagination = () => {
    let paginationHTML="";

    let totalPage = Math.ceil(totalCount/31)
    let pageGroup = Math.ceil(currentPage/10);
    let last = pageGroup*10;
      if (last > totalPage) {
        last = totalPage
      }
    let first = last - 9 <= 0 ? 1 : last -9; 


    if(first > 10){
    paginationHTML =`
    <li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${currentPage - (currentPage-1)})">
      <span aria-hidden="true">&laquo;</span>
    </a>
    
    <li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${currentPage - 1})">
      <span aria-hidden="true">&lt;</span>
    </a>
    </li>`
    }
    for(let i=first;i<=last;i++){
      paginationHTML += `<li class="page-item ${currentPage==i? "active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }

    
    if(last < totalPage){
      paginationHTML += `
    <li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${currentPage + 1})">
      <span aria-hidden="true">&gt;</span>
    </a>
    </li>
  
    <li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${totalPage})">
      <span aria-hidden="true">&raquo;</span>
    </a>
    </li>
  `
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
getMainPage();