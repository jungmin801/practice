let recipes = [];
let recipesList = [];

//카테고리 버튼을 가져와서 이벤트리스너를 생성




const callAPI = async() =>{
    
    let url = new URL(`https://api.edamam.com/search?q=vegan&app_id=e3cf5ffc&app_key=d9c140d574c8e323e87a00a286665ad4&from=0&to=20`);
    let header = new Headers({'x-api-key':'d9c140d574c8e323e87a00a286665ad4'});
    let response = await fetch(url,{headers:header});
    let data = await response.json();

    recipes = data.hits;
    // for(let i=0;i<=recipes.length;i++){
    //     recipesList.push(recipes[i].recipe);
    // }   
    recipes.forEach((item) => {
        recipesList.push(item.recipe);
      });

      console.log(recipesList)
      render()

    
}

callAPI();


//카테고리별 보여주기
// const ByCategory() {
//     let url = new URL(`https://api.edamam.com/search?q=vegan&app_id=e3cf5ffc&app_key=d9c140d574c8e323e87a00a286665ad4&from=0&to=15`);
//     let header = new Headers({'x-api-key':'d9c140d574c8e323e87a00a286665ad4'});
//     let response = await fetch(url,{headers:header});
//     let data = await response.json();

//     recipes = data.hits;
//     // for(let i=0;i<=recipes.length;i++){
//     //     recipesList.push(recipes[i].recipe);
//     // }   
//     recipes.forEach((item) => {
//         recipesList.push(item.recipe);
//       });
// }



    
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
                    <span>${Math.ceil(item.calories/item.yield)}Kcal/serving</span>
                </div>
            </div>
          </div>
        </div>
      </div>`
    }).join('');

    document.getElementById("recipes-board").innerHTML = recipesHTML;
}

