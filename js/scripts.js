
// const SearchSubmit  = document.querySelector('form');
const searchSection = document.querySelector(".search-container");
const searchWord = document.querySelector("#search-input");
const url = "https://randomuser.me/api/?results=12&gender=male&nat=US";
const gallery = document.getElementById('gallery');
let prevModalBtn = document.getElementById('modal-prev');
let nextModalBtn = document.getElementById('modal-next');
let closeModal   = document.getElementById('modal-close-btn');
let allBeforeFilter=[];
let employee= [];
let modal;
let employeeIndex=0;



/*
    JS fetch function to get employee profiles from randomuser.me
 */
 fetch(url)
     .then(response => response.json()) //convert to jason format
     .then(profiles => {            // call card generator function to display all profiles
         generateDataCard(profiles.results)
         console.log("profile --> ");
         console.log(profiles.results);
         employee = profiles.results;
     })
     .then(generateSearchFormHTML) // generate search form
     .catch(err => console.log(err))



/*
    display search form in the top right corner
 */
function generateSearchFormHTML(){
    const searchForm = ' <form action="#" method="get">\n' +
        '                    <input type="search" id="search-input" class="search-input" placeholder="Search...">\n' +
        '                    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">\n' +
        '                </form>';

    searchSection.insertAdjacentHTML("beforeend", searchForm);
}

/*
    display all profiles with card style
 */
function generateDataCard(data){
    allBeforeFilter =employee;
    employee=data;
    gallery.innerHTML = '';
    data.forEach((element, index) => {
        html =`
        <div class="card" data-index=${index}>
            <div class="card-img-container">
                <img class="card-img" src=${element.picture.large} alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${element.name.first} ${element.name.last}</h3>
                <p class="card-text">${element.email}</p>
                <p class="card-text cap">${element.location.city}, ${element.location.state}</p>
            </div>
        </div>`
        gallery.insertAdjacentHTML("beforeend", html);

    })

}
/*
    generate Modal for  sellected profiles
 */
function generateModalWindow(item){

    let modalHtml = ` <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src=${item.picture.large} alt="profile picture">
                    <h3 id="name" class="modal-name cap">${item.name.first} ${item.name.last}</h3>
                    <p class="modal-text">${item.email}</p>
                    <p class="modal-text cap">${item.location.city}</p>
                    <hr>
                     <p class="modal-text">${reformPhoneNumber(item.phone)}</p>
                     <p class="modal-text">${item.location.street.number} ${item.location.street.name}, ${item.location.city}, ${item.location.state} ${item.location.country} ${item.location.postcode}</p>
                     <p class="modal-text">Birthday: ${reformDob(item.dob.date.slice(0,10))}</p>
                     <p id="edge-message" class="modal-edge-message" ></p>
            </div>
        </div>

        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
   
    </div>`


    document.body.insertAdjacentHTML("beforeend", modalHtml);
    modal = document.querySelector(".modal");
    let prevModalBtn = document.getElementById('modal-prev');
    nextModalBtn = document.getElementById('modal-next');
    closeModal   = document.getElementById('modal-close-btn');

    /*
        display previous Modal
     */
    prevModalBtn.addEventListener("click", e => {

        employeeIndex--;
        if(employeeIndex <0){
            messageHtml=  "Top of the list";
            let msg = document.getElementById("edge-message");
            msg.innerText=messageHtml;
            employeeIndex++;
        }else {
            document.body.lastElementChild.remove();
            generateModalWindow(employee[employeeIndex]);
        }


    });

    /*
        display next Modal
     */
    nextModalBtn.addEventListener("click", e =>{

        employeeIndex++;
        if(employeeIndex+1 > employee.length){
            messageHtml=  "No more in the list";
            let msg = document.getElementById("edge-message");
            msg.innerText=messageHtml;
            employeeIndex--;
        }else {
            document.body.lastElementChild.remove();
            generateModalWindow(employee[employeeIndex]);
        }

    });
    /*
    close Modal
     */
    closeModal.addEventListener("click", e =>{
        document.body.lastElementChild.remove();


    });



}


/*
    re format phone number to  (xxx) xxx-xxxx
 */
function reformPhoneNumber(numberString){
     let number;// = numberString.replace(/\D/g,'-');

    /*
      @ 2021 Stack Exchange Inc
     https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript/41318684
     */

     let cleaned = ('' + numberString).replace(/\D/g, '');
     let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
     if (match) {
        let intlCode = (match[1] ? '+1 ' : '');
        number = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');

        return number;
     }
     return numberString;

}

/*
    reformat date from dd/mm/yyyy to mm/dd/yyyy
 */
function reformDob(dob){

     return dob.slice(5,7) + '\/'+ dob.slice(8,10) + '\/' + dob.slice(0,4);
}

/*
listeners
 */
/*
    search form  listener
 */
searchSection.addEventListener("submit", () =>{
    employeeFiltered =[]
    const searchString =document.getElementById("search-input").value.toLowerCase();
    if(searchString !==''){
        employeeFiltered = employee.filter(item  => item.name.first.toLowerCase().includes(searchString) || item.name.last.toLowerCase().includes(searchString));
        console.log(employeeFiltered);
        console.log(employeeFiltered.length);
        generateDataCard(employeeFiltered);
    }else {
        employeeFiltered = allBeforeFilter;
        generateDataCard(employeeFiltered);
    }
} )

/*
    listen to click in any profile to call generateModalWindow
 */
gallery.addEventListener("click", event => {


    let card;

    console.log(event.target)
    let item = event.target;
    console.log( item );
    if(item.className === "card-img-container" || item.className === "card-info-container"){
        card = item.parentNode;
    }else if(item.className === "card-img" || item.className === "card-name cap" || item.className === "card-text" || item.className === "card-text cap"){
        card =item.parentNode.parentNode;
    }else card = item;
    employeeIndex = parseInt(card.dataset.index);
    console.log(card);
    console.log(employee[employeeIndex]);
    generateModalWindow(employee[employeeIndex]);


})







