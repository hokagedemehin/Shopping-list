// select items
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit options
let editElement;
let editFlag = false;
let editID = "";

// event listeners
// submit form
form.addEventListener('submit', addItem);
// clear button
clearBtn.addEventListener('click', clearItems);
// load items
window.addEventListener('DOMContentLoaded', setUpItems);
// ##################### functions ############################

// ********************************************************
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    // console.log(value);

    const id = new Date().getTime().toString();
    if (value && !editFlag) {
        // console.log('add items to the list');
        createListItem(id, value);
        // display alert
        displayAlert("Item added to the list", 'success');
        // show container
        container.classList.add('show-container');
        // add to local storage
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();

    } else if( value && editFlag) {
        // console.log('editting');
        editElement.innerHTML = value;
        displayAlert('Value change is successful', 'success');
        // edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    }
    else {
        // console.log('empty value');
        displayAlert('please enter a value', 'danger');
    }
}
// *************************************
// display alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(()=>{
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`)
    }, 1500);
}

// ***************************************************
// clear items
function clearItems() {
    const items = document.querySelectorAll('.grocery-item');
    if (items.length > 0) {
        items.forEach((item)=>{
            list.removeChild(item);
        });
    } 
    container.classList.remove('show-container');
    displayAlert("List has been cleared", 'danger');
    setBackToDefault();
    localStorage.removeItem('list');
}
// ****************************************
// delete funtion
function deleteItem(event) {
    const element = event.currentTarget.parentElement.parentElement; //This goes two levels up to second the parent item "grocery-list"
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length == 0) {
        container.classList.remove('show-container');
    }
    displayAlert('Item is removed', 'danger');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

// *****************************************************************
// edit function
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = 'edit';
}

// *****************************************************
// set back to default
function setBackToDefault() {
    grocery.value='';
    editFlag = false;
    editID = '';

    submitBtn.textContent = "submit";
}
// ****************************************************
// ############## local storage ####################
function addToLocalStorage(id, value) {
    const grocery = {id:id, value:value};
    // console.log(grocery);
    let items = getLocalStorage();
    console.log(items);
    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));

}

// ********************************************
// remove from local storage
function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter((item)=>{
        if (item.id !== id) {
            return item
        }
    });
    localStorage.setItem('list', JSON.stringify(items));
}

// **********************************************
// edit from local storage
function editLocalStorage(id, value) {
    // localStorage API
    let items = getLocalStorage();
    items = items.map((item)=>{
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));

}

// ******************************************************************
// get from local storage
function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

//################## setup items ###########################
// ************************************************
function setUpItems(params) {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach((item)=>{
            createListItem(item.id, item.value)
        });
        container.classList.add('show-container');
    }
}

// ********************************************
// create a list item
function createListItem(id, value) {
    const element = document.createElement('article');
    // add class
    element.classList.add('grocery-item')
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fas fa-edit    "></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fas fa-trash    "></i>
        </button>
    </div>`;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');

    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    // append child inside grocery-list class div
    list.appendChild(element);
}
