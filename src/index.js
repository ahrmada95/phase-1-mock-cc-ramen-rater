//ramen url
const url = 'http://localhost:3000/ramens';
//global ramen id variable for editing
let currRamenId = 0;
//grab ramen menu
const ramenMenu = document.getElementById('ramen-menu');
//grab the selected ramen image
const selectedImg = document.querySelector('#ramen-detail > img');
//grab the selected ramen name
const selectedName = document.querySelector('#ramen-detail > h2');
//grab the selected ramen restaurant
const selectedRestaurant = document.querySelector('#ramen-detail > h3');
//grab the selected ramen rating
const selectedRating = document.querySelector('#rating-display');
//grab the selected ramen comment
const selectedComment = document.querySelector('#comment-display');
//grab the form to add new ramen
const newRamen = document.querySelector('#new-ramen');
//grab the form to edit current ramen
const editRamen = document.querySelector('#edit-ramen');
//grab the form element to delete current ramne
const deleteRamen = document.querySelector("#delete")


const fetchRamen = async () => {
    //request from db
    const req = await fetch(url);
    //get promise as json
    const res = await req.json();
    return res;
};

const renderMenu = async () => {
    //clear the div
    ramenMenu.innerHTML = '';
    //get data struct from promise
    let currMenu = await fetchRamen();
    //iterate through each, make new image element and append
    //event listener for selecting from menu
    currMenu.forEach(ramenItem => {
        //make element
        let menuImg = document.createElement('img');
        //change img src 
        menuImg.src = `${ramenItem.image}`;
        //specify the class
        menuImg.classList.add('#ramen-menu');
        //apend 
        ramenMenu.append(menuImg);

        //event listener
        menuImg.addEventListener('click', () => {
            //set ramen image
            selectedImg.src = ramenItem.image;
            //set ramen name
            selectedName.textContent = ramenItem.name;
            //set ramen restaurant
            selectedRestaurant.textContent = ramenItem.restaurant;
            //set ramen rating
            selectedRating.textContent = ramenItem.rating;
            //set ramen comment
            selectedComment.textContent = ramenItem.comment;
            //change global variable (USE THIS TO EDIT)
            currRamenId = ramenItem.id;
            console.log(currRamenId)
        })
    });
}

const setInitial = async () => {
    //get data struct from promise
    let currMenu = await fetchRamen();
    //get first item from db
    const ramenItem = currMenu[0];

    //set that shit by data member
    selectedImg.src = currMenu[0].image;
    selectedName.textContent = currMenu[0].name;
    selectedRestaurant.textContent = currMenu[0].restaurant;
    selectedRating.textContent = currMenu[0].rating;
    selectedComment.textContent = currMenu[0].comment;

    //set curr id
    currRamenId = currMenu[0].id;
}

//adding new ramen entry event listener 
newRamen.addEventListener('submit', (event) => {
    //prevent refresh
    event.preventDefault();

    //make new object to hold info
    const newRamenEntry = {
        name: newRamen['name'].value,
        restaurant: newRamen['restaurant'].value,
        image: newRamen['image'].value,
        rating: newRamen['rating'].value,
        comment: newRamen['new-comment'].value,
    }

    //stringified obj 
    let newRamenEntryDb = JSON.stringify(newRamenEntry);

    //post that bitch into the db
    let addNew = fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        //attach here
        body: newRamenEntryDb,
    })

    //make element
    let menuImg = document.createElement('img');
    //change img src 
    menuImg.src = `${newRamenEntry.image}`;
    //specify the class
    menuImg.classList.add('#ramen-menu');
    //apend 
    ramenMenu.append(menuImg); 

    //event listener
    menuImg.addEventListener('click', () => {
        //set ramen image
        selectedImg.src = newRamenEntry.image;
        //set ramen name
        selectedName.textContent = newRamenEntry.name;
        //set ramen restaurant
        selectedRestaurant.textContent = newRamenEntry.restaurant;
        //set ramen rating
        selectedRating.textContent = newRamenEntry.rating;
        //set ramen comment
        selectedComment.textContent = newRamenEntry.comment;

    })
})

editRamen.addEventListener('submit', async (event) => {
    alert('pressing submit')
    //prevent default
    event.preventDefault();
    //fetch array
    let currMenu = await fetchRamen();
    console.log(editRamen['rating'].value);
    console.log(editRamen['new-comment'].value);

    //if rating is not blank, update JUST the RATING
    if(editRamen['rating'].value != ''){
        fetch(`${url}/${currRamenId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                rating: editRamen['rating'].value,
            }),
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        }).then((response) => response.json());
        //correct current display
        selectedRating.textContent = editRamen['rating'].value;
    }

    //if new comment is not blank, update JUST the COMMENT
    if(editRamen['new-comment'].value != ''){
        fetch(`${url}/${currRamenId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                comment: editRamen['new-comment'].value,
            }),
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        }).then((response) => response.json());
        //correct current display
        selectedComment.textContent = editRamen['new-comment'].value;
    }
})

//listen for delete button being pressed
deleteRamen.addEventListener('click', async (event) => {
    let currMenu = await fetchRamen();

    //make sure there is something to delete first
    if(currMenu.length > 0){
        //ask user for confirmation
        if(confirm('Are you sure you want to delete this entry?')){
            //delete request
            fetch(`${url}/${currRamenId}`, {
                method: 'DELETE',
            }).then((response) => {
                //you have to rerender the menu within the then because of asynchronus op
                //if done out side of the fetch, then it will execute before the promise resolves
                response.json()
                renderMenu();
                setInitial();
            });

        } else {
            alert('Deletion cancelled');
        }
    } else {
        alert('ERROR: Nothing left to be deleted')
    }
    
})

renderMenu();
setInitial();