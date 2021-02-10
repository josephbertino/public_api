// script.js
// Author: Joe Bertino, 2021

// Document Elements
const gallery = document.querySelector('div.gallery');
const searchContainer = document.querySelector('div.search-container');

// Add Markup to the Employee Directory Page
const searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
    `;
searchContainer.insertAdjacentHTML('beforeend', searchHTML);

// Fetch the Random User data with the API
const infoList = "name,location,email,picture,cell,dob";
let userProfiles;
fetch(`https://randomuser.me/api/?format=json&results=12&inc=${infoList}&nat=us`)
.then(res => res.json())
.then(data => {
    userProfiles = data.results;
    userProfiles.map(drawUserCard);
});

/**
 *
 */
function drawUserCard(user, idx) {
    const name = user.name;
    const location = user.location;
    const div = document.createElement('div');
    div.className = "card";
    div.id = `user_${idx}`;
    console.log(user, idx);
    const cardHTML = `
        <div class="card-img-container">
            <img class="card-img" src="${user.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${location.city}, ${location.state}</p>
        </div>
        `;
    div.insertAdjacentHTML('beforeend', cardHTML);
    div.addEventListener('click', drawUserModal);
    gallery.appendChild(div);
}

/**
 *
 */
function getDOB(dobstr) {
    const yyyymmdd = dobstr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return `${yyyymmdd[2]}/${yyyymmdd[3]}/${yyyymmdd[1]}`;
}

/**
 *
 */
function drawUserModal(event) {
    const userId = event.currentTarget.id.match(/^user_(\d*)$/)[1]
    const user = userProfiles[userId];
    const location = user.location;
    const bday = getDOB(user.dob.date);
    const fullAddr = `${location.street.number} ${location.street.name}, ${location.city}, ${location.state} ${location.postcode}`;
    
    const modalHTML = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="modal-text">${user.email}</p>
                    <p class="modal-text cap">${location.city}</p>
                    <hr>
                    <p class="modal-text">${user.cell}</p>
                    <p class="modal-text">${fullAddr}</p>
                    <p class="modal-text">Birthday: ${bday}</p>
                </div>
            </div>
        </div>
    `;
    gallery.insertAdjacentHTML('afterend',modalHTML);
    
    document.getElementById('modal-close-btn').addEventListener('click', (e) => {
        document.querySelector('div.modal-container').remove();
    });
}