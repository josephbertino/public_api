# Awesome Startup
Author: Joe Bertino, 2021

## Description
* Awesome Startup is a distributed company with remote employees working all over the world. 

* This app, built with Javascript, is a mockup of an employee directory for the Company. It communicates with the Random User Generator API (https://randomuser.me/) to retrieve contact information and profile pictures of the company "members".

## Functionality
* Upon opening the app, 12 employees are listed in a grid with their thumbnail image, full name, email, and location.

* Clicking the employee’s profile card will open a modal window with more detailed information, including the employee’s birthday and address.

## Exceeds Expectations 

1) **Name Filter**: The Text Input bar in the upper right hand corner of the page is for filtering users by first and/or last name. Simply start typing any substring of a user's name, and the profile cards will dynamically display / hide based on your filter pattern.

2) **Modal Toggle**: In the User Details modal window, use the "Prev" and "Next" navigation buttons at the bottom to toggle back and forth between the user profiles without having to close and re-open the modal window! Bonus features include:
* Functionality wraps around through the collection of users. So you can press "Next" while viewing the last user on the page, and you will then see the first user. (Similarly for hitting "Prev" on the first user).
* You will only toggle through users that were actively displayed on the page when the modal window was opened. That is, you will only see users that pass the current name filter.

3) **CSS Customizations**
* Color-coded the user profile cards ('div.card' elements) according to user gender (as received by the API call).