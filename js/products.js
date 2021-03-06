// Variables que van a determinar los criterios por los cuales se van a ordenar los filtros, tanto de precios como de relevancia.//

const ORDER_ASC_BY_PRICE = "Price+";
const ORDER_DESC_BY_PRICE = "Price-";
const ORDER_BY_RELEVANCY = "Relevancy";
var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCost = undefined;
var maxCost = undefined;

function sortProducts(criteria, array){
  let result = [];
  if (criteria === ORDER_ASC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ) return -1;
            if ( a.cost > b.cost ) return 1;
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ) return -1;
            if ( a.cost < b.cost ) return 1;
            return 0;
        });
    }else if (criteria === ORDER_BY_RELEVANCY){
        result = array.sort(function(a, b) {
          let aSold = parseInt(a.soldCount);
          let bSold = parseInt(b.soldCount);

          if ( aSold > bSold ) return -1;
          if ( aSold < bSold ) return 1;
            return 0;
        });
    }

  return result;
}


function showProductsList(){
  let htmlContentToAppend = "";

  for(product of currentProductsArray){ //Para cada producto de mi array de productos actuales
    const {cost, imgSrc, description, soldCount, name, currency} = product; // Desestructuracion de objeto,(para acceder mas facilmente a las propiedades del producto)
      
    if (((minCost == undefined) || (minCost != undefined && parseInt(cost) >= minCost)) && //Voy a mostrar el producto siempre y cuando:
        ((maxCost == undefined) || (maxCost != undefined && parseInt(cost) <= maxCost))){  //No haya un filtro puesto, o si el producto esta dentro de los rangos establecidos

        htmlContentToAppend += `
        <a href="product-info.html" class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="./${imgSrc}" alt="${description}" class="img-thumbnail">
                </div>
                <div class="col">
                  <div class="row h-100 mx-0">
                      <div class="d-flex w-100 justify-content-between overflow-auto  ">
                          <h4 class="mb-1">${name}</h4>
                          <small class="text-muted">${soldCount} vendidos</small>
                      </div>
                      <p class="mb-1">${description}</p>
                      <div class="d-flex w-100 justify-content-end" style="min-height: 50%;align-items: flex-end;">
                        <p class="">$${cost} ${currency}</p>
                      </div>
                    </div>
                </div>
            </div>
        </a>
        `
      }
      document.getElementById("prod-list-container").innerHTML = htmlContentToAppend; //Inserto los htmls de mis productos en en div padre para mostrar.
  }
}

function sortAndShowProducts(sortCriteria, productsArray){
  currentSortCriteria = sortCriteria; //Establezco mi criterio de ordenamiento

  if(productsArray != undefined){
      currentProductsArray = productsArray; //Establezco mi array de productos siempre y cuando no este vacio
  }

  currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray); //Reordeno mis productos de acuerdo al criterio de ordenamiento establecido

  showProductsList(); //Muestro los productos ordenados
}


//Funci??n que se ejecuta una vez que se haya lanzado el evento de que el documento se encuentra cargado, 
// es decir, se encuentran todos los elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCTS_URL).then(function(resultObj){
    if (resultObj.status === "ok"){
      sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data);
    }
  });
  
  document.getElementById("sortAscPrice").addEventListener("click", () => {
    sortAndShowProducts(ORDER_ASC_BY_PRICE);
  });

  document.getElementById("sortDescPrice").addEventListener("click", () => {
      sortAndShowProducts(ORDER_DESC_BY_PRICE);
  });

  document.getElementById("sortBySoldCount").addEventListener("click", () => {
      sortAndShowProducts(ORDER_BY_RELEVANCY);
  });

  document.getElementById("clearRangeFilter").addEventListener("click", () => {
    document.getElementById("rangeFilterPriceMin").value = "";
    document.getElementById("rangeFilterPriceMax").value = "";

    minCost = undefined;
    maxCost = undefined;

    showProductsList();
  });



  document.getElementById("rangeFilterPrice").addEventListener("click", () => {
    //Obtengo el m??nimo y m??ximo de los intervalos para filtrar por precio
    minCost = document.getElementById("rangeFilterPriceMin").value;
    maxCost = document.getElementById("rangeFilterPriceMax").value;

      if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0)
          minCost = parseInt(minCost);
      else
          minCost = undefined;

      if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0)
          maxCost = parseInt(maxCost);
      else
          maxCost = undefined;
      
      showProductsList();
  });
  
});