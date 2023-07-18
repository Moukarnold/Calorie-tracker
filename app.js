// Storage controller
const StorageCtrl = (function() {
    // TODO: Implement storage controller logic
  })();
  
  // Item controller
  const ItemCtrl = (function() {
    // Item Constructor
    const Item = function(id, name, calories) {
      this.id = id;
      this.name = name;
      this.calories = calories;
    };
  
    // Data structure / state
    const data = {
      items: [
    //     { id: 0, name: "Steak Dinner", calories: 1200 },
    //     { id: 1, name: "Cookie", calories: 400 },
    //     { id: 2, name: "Eggs", calories: 300 }
      ],
      currentItem: null,
      totalCalories: 0
    };
  
    // Public methods
    return {
      getItems: function() {
        return data.items;
      },
      
      addItem:function (name, calories){
        // create ID
        let ID;
        if (data.items.length >0 ){
             ID = data.items[data.items.length - 1].id +1;
        } else {
            ID = 0;
        }

      // calories to number
       calories = parseInt(calories);

       // create new item
       newItem = new Item (ID, name, calories);
        data.items.push(newItem);

        return newItem;
    },

    logData: function() {
        return data;
      }
    };
  })();
  
  // UI controller
  const UICtrl = (function() {
    const UISelectors = {
      itemList: "#item-list",
      addBtn: ".add-btn",
      itemNameInput: "#item-name",
      itemCaloriesInput:"#item-calories"
    };
  
    
    return {
      populateItemList: function(items) {
        let html = "";
  
        items.forEach(function(item) {
          html += `<li class="collection-item" id="item-${item.id}">
              <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
              <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i> </a>
            </li>`;
        });
  
        // Insert list items
        document.querySelector(UISelectors.itemList).innerHTML = html;
      },

      getItemInput: function(){
        return{
            name: document.querySelector(UISelectors.itemNameInput).value,
            calories: document.querySelector(UISelectors.itemCaloriesInput).value
        }
      },

       addListItem: function(item){

        //show the list
        document.querySelector(UISelectors.itemList).style.display= "block";
        
        // create li element
             const li = document.createElement("li");
             li.className="collection-item";
             li.id = "item-${item.id}";
             li.innerHTML= ` <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
             <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i> </a>`;

             document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li)  
                 },

                 clearInput:function(){
                   document.querySelector(UISelectors.itemNameInput).value = "";
                   document.querySelector(UISelectors.itemCaloriesInput).value = "";

                 },
        
                 hideList: function(){
                   document.querySelector(UISelectors.itemList).style.display = "none"
                 },


      getSelectors: function() {
        return UISelectors;
      }
    };
  })();
  
  // App controller
  const App = (function(ItemCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function() {
      // Get UI selectors
      const UISelectors = UICtrl.getSelectors();
  
      // Add item event
      document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
  
      // Item add submit
      function itemAddSubmit(e) {

        // get form inout from UI Controler
          const input = UICtrl.getItemInput();

          //check for the name and calorie input
           if(input.name !== "" & input.calories !== ""){
                // Add item
                const newItem= ItemCtrl.addItem(input.name, input.calories);
                // add item to ui list
                
                UICtrl.addListItem(newItem);

                // clear fields
                UICtrl.clearInput();
        
            }

        e.preventDefault();

      }
    };
  
    return {
      init: function() {
        // Fetch items from data structure
        const items = ItemCtrl.getItems();
         // check if any items
         if (items.length===0){
            UICtrl.hideList();
         } else { }
        // Populate list with items
        UICtrl.populateItemList(items);
  
        // Load event listeners
        loadEventListeners();
      }
    };
  })(ItemCtrl, UICtrl);
  
  // Initialize App
  App.init();
  