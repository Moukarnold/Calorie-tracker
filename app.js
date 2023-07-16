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
    logData: function(){
        return data;
    }
}
})()


// ui controller

const UICtrl =( function(){

   
})()



// app controller
const App =( function(ItemCtrl,UICtrl ){

    return{
        init: function(){
            console.log("initializing App ...")
        }
    }
})(ItemCtrl,UICtrl)

// initialize App

App.init();