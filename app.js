// Storage controller
const StorageCtrl = (function() {
  return {
    storeItem: function(item) {
      let items;

      // Check if any items in local storage
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // Get what is already in local storage
        items = JSON.parse(localStorage.getItem("items"));

        // Push new item
        items.push(item);

        // Reset local storage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
          let items = JSON.parse(localStorage.getItem("items"));

          items.forEach(function(item, index){
            if(updatedItem.id === item.id){
                items.splice(index, 1 , updatedItem);
            }
          });
       localStorage.setItem("items", JSON.stringify(items));
    },

    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function(item, index) {
        if (item.id === updatedItem.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function(item, index) {
        if (item.id === id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem("items");
    }
  };
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
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // Public methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      const newItem = new Item(ID, name, calories);
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      StorageCtrl.updateItemStorage(found);

      return found;
    },
    deleteItem: function(id) {
      StorageCtrl.deleteItemFromStorage(id);

      const ids = data.items.map(function(item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      StorageCtrl.clearItemsFromStorage();
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      data.items.forEach(function(item) {
        total += item.calories;
      });

      data.totalCalories = total;
      return data.totalCalories;
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
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
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

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";

      // Create li element
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i> </a>
      `;

      document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn NodeList into array
      listItems = Array.from(listItems);
      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i> </a>`;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn NodeList into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        item.remove();
      });
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

    // Disable submit on enter
    document.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

    // Update item event 
    document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

    // Delete item event 
    document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener("click", UICtrl.clearEditState);

    // Clear item event 
    document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);
  };

  // Item add submit
  function itemAddSubmit(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for the name and calorie input
    if (input.name !== "" && input.calories !== "") {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Show total calories
      UICtrl.showTotalCalories(totalCalories);

      // Store in local storage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();

    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Show total calories
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();  

    e.preventDefault();
  }

  // Clear items event
  const clearAllItemsClick = function() {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Show total calories
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Hide ul
    UICtrl.hideList();
  }

  // Delete button event
  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Show total calories
    UICtrl.showTotalCalories(totalCalories);


    // update local storage
    StorageCtrl.updateItemStorage(updatedItem);


    UICtrl.clearEditState();  

    e.preventDefault();
  }

  // Click edit item
  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // Get the list item id (item-0, item-1, ...)
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split("-");
      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };

  return {
    init: function() {
      // Clear edit state / set initial state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      }

      // Populate list with items
      UICtrl.populateItemList(items);

      // Load event listeners
      loadEventListeners();

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Show total calories
      UICtrl.showTotalCalories(totalCalories);
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();
