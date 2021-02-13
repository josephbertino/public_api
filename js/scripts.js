// script.js
// Author: Joe Bertino, 2021

// Document Elements
const gallery = document.querySelector('div.gallery');
const searchContainer = document.querySelector('div.search-container');

// Store the user profiles in this global variable
const userProfiles = [];
// The list of profile data points we want to fetch per user
const infoList = "name,location,email,picture,cell,dob,gender";
// Fetch the Random User data via the API
fetch(`https://randomuser.me/api/?format=json&results=12&inc=${infoList}&nat=us`)
.then(res => res.json())
.then(data => {
    data.results.map(drawUserCard);
})
.catch( e => console.log("Error fetching user data:", e) );

/**
 * Given a user data object, add a Profile card to the main page with that data
 * @param {Object}  user    The JSON object containing user profile data
 * @param {number}  idx     The index of this object when it's pushed to userProfiles[]
 */
function drawUserCard(user, idx) {
    // Add the user profile object to the global list
    userProfiles.push(user);
    
    // Create div for user card
    const div = document.createElement('div');
    div.className = `card ${user.gender}`;
    // Set id of div to idx, so that when this card is clicked, the drawUserModal() function knows which user profile to access 
    div.id = `user${idx}`;
    const cardInnerHTML = `
        <div class="card-img-container}">
            <img class="card-img" src="${user.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
        `;
    div.insertAdjacentHTML('beforeend', cardInnerHTML);
    
    // Enable clicking the card to draw modal window for user
    div.addEventListener('click', drawUserModal);
    
    // Finally, add this div to the main page
    gallery.appendChild(div);
}

/**
 * Use regex to extract date components from a string
 * @param {string}  dobstr  The string containing date information
 * @returns {string}    The birthdate formatted as MM/DD/YYYY
 */
function getDOB(dobstr) {
    const yyyymmdd = dobstr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return `${yyyymmdd[2]}/${yyyymmdd[3]}/${yyyymmdd[1]}`;
}

/**
 * Create a modal window to display a user's full details, with navigational and close functionality
 * @param {Object}  event   The event object associated with clicking a user's card on the main page
 */
function drawUserModal(event) {
    // Obtain the userID from the div card's id
    const userId = event.currentTarget.id.match(/^user(\d*)$/)[1];
    // modalHTML contains the user-info portion of the modal window
    const modalHTML = fillUserModalInfo(userId);
    
    const containerHTML = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container" id="${userId}">
                    ${modalHTML}
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
    gallery.insertAdjacentHTML('afterend',containerHTML);
    
    // Close modal window if you click the "X" button
    document.getElementById('modal-close-btn').addEventListener('click', (e) => {
        document.querySelector('div.modal-container').remove();
    });
    
    // Allow for forward & backward navigation of users in the modal window
    document.querySelector('button.modal-prev.btn').addEventListener('click', switchModal);
    document.querySelector('button.modal-next.btn').addEventListener('click', switchModal);
}

/**
 * Update the Modal window's modal-info-container with a different user profile
 * @param {Object}  e   The event associated with clicking one of the navigation buttons in the modal window
 */
function switchModal(e) {
    // The id of the current modal info container is also the currently displayed user's ID
    let userId = parseInt(document.querySelector(".modal-info-container").id);
    
    // We are going to iterate through the user profiles. So we need to know whether to iterate
    // forwards ('next') or backwards ('prev'), with wrapping around
    let increment;
    if (e.target.classList.contains('modal-prev')) {
        // Modulo % does not work with negative number in JS
        // So just add by (total - 1), in case userId === 0
        increment = (userProfiles.length - 1);
    } else { // it contains 'modal-next'
        increment = 1;
    }
    
    // Iterate through 'div.card' elements until we find the next one that's currently displayed
    // (based on the user name filtering)
    while(true) {
        userId = (userId + increment) % userProfiles.length;
        if (document.querySelector(`div.card#user${userId}`).style.display !== 'none') {
            break;
        }
    }
    
    // Remove the current modal-info-container
    document.querySelector(".modal-info-container").remove();
    // Create a new modal-info-container
    const newModal = document.createElement('div')
    newModal.className = "modal-info-container";
    newModal.id = `${userId}`;
    // Write the user's profile details into the modal-info-container
    newModal.insertAdjacentHTML('beforeend',fillUserModalInfo(userId));
    // Add the modal-info-container to the modal window
    document.querySelector('.modal').appendChild(newModal);
}

/**
 * Writes the chunk of HTML containing full user details for the modal window
 * @param {number}  userId  Index into global list of user profile objects
 * @returns {string} HTML string containing user profile info for modal window 
 */
function fillUserModalInfo(userId) {
    const user = userProfiles[userId];
    const location = user.location;
    const bday = getDOB(user.dob.date);
    const fullAddr = `${location.street.number} ${location.street.name}, ${location.city}, ${location.state} ${location.postcode}`;
    
    const modalHTML = `
    <img class="modal-img" src="${user.picture.large}" alt="profile picture">
    <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
    <p class="modal-text">${user.email}</p>
    <p class="modal-text cap">${location.city}</p>
    <hr>
    <p class="modal-text">${user.cell}</p>
    <p class="modal-text">${fullAddr}</p>
    <p class="modal-text">Birthday: ${bday}</p>
    `;
    
    return modalHTML;
}

// For Exceeds Expectations, Add a Filter feature to the User Page
const searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search User...">
    </form>
    `;
searchContainer.insertAdjacentHTML('beforeend', searchHTML);
const filterInput = document.querySelector('input#search-input');
filterInput.addEventListener('keyup', filterUsers);

/**
 * Filter user cards on the page by their First and Last Names
 * @param {Object} event    The Object for the Filter bar's keyup event
 */
function filterUsers(event) {
    /*
    trim() whitespace to allow for the possibility of a pattern including portions of both the first and last name. 
    */
    let pattern = filterInput.value.toLowerCase().trim();
    
    // Iterate through the div.card elements, looking for profiles whose names match or include the pattern entered in the Filter bar. Configure each div's 'display' property based on match
    const cards = document.querySelectorAll('div.card');
    cards.forEach((card) => {
        let username = card.querySelector('h3#name').textContent.toLowerCase();
        
        // If the pattern is found in the student name, add the student to our filtered list
        if (username.includes(pattern)) {
            $(card).show();
        } else {
            $(card).hide();
        }
    });
}