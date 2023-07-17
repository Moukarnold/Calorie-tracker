// storage controller


// item ontroller
const ItemCtrl =( function(){
    // item Constructor
    const Item = function (id, name, calories){
        this.id= id;
        this.name = name;
        this.calories= calories;
    }

    // Data structure/ state
    const data ={
        items: [
            {  id: 0, name: "steak Dinner", calories: 1200},
            {  id: 1, name: "Cookie", calories: 400},
            {  id: 2, name: "Eggs", calories: 300},
      
        ],
        currentItem: null,
        totalCalories: 0
    }

return{
    getItems: function(){
        return data.items;
    },
    logData: function(){
        return data;
    }
}
})()


// ui controller

const UICtrl =( function(){

    const UISelectors = {itemList:  "#item-list" }
   
     // Public methods
     return{

        populateItemList: function(items){
            let html= "";

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
               <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i> </a>
            </li> `;
            });    

          // insert list items
          document.querySelector("#item-list").innerHTML= html;
    
        }
     
    }
})();



// app controller
const App =( function(ItemCtrl,UICtrl ){

    return{
        init: function(){
          
            // fetch items from data structure
            const items= ItemCtrl.getItems();

           // populate list with items
           UICtrl.populateItemList(items);
         }
    }
})(ItemCtrl,UICtrl)

// initialize App

App.init();


