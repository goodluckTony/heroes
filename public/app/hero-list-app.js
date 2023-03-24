const name = document.querySelector('.name');
const age = document.querySelector('.age');
const power = document.querySelector('.power');
const gender = document.querySelector('.gender');
const heroBox = document.querySelector('.main-box');
const heroCard = document.querySelector('.hero-box');
const btnRemove = document.querySelector('.btn-remove');
// const url = new URL(window.location.href);
// const id = url.searchParams.get('id');

fetch('http://localhost:3500/api/heroes', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(async response => {
    const box = document.querySelector('.main-box');
    let res = await response.json();
//  res.sort((a,b) => b.age - a.age);
    for (let i in res) {
        let hero = res[i];
        let heroHTML = `
            <div class="hero-box" id="${hero._id}" onclick="window.location.href='http://localhost:3500/hero-details.html?id=${hero._id}'">
                <p class="title-img">Hero photo:</p>
                <img src="${hero.img}" class="hero-photo"></img>
                <p class="title-name">Name:</p>
                <h2 class="name">${hero.name}</h2>
                <p class="title-power">Power:</p>
                <h2 class="power">${hero.power}</h2>
                <p class="title-age">Age:</p>
                <h2 class="age">${hero.age}</h2>
                <p class="title-gender">Gender:</p>
                <h2 class="gender">${hero.gender}</h2>
                <a class="btn-remove" value="" onclick="removeHeroCard('${hero._id}', event)" required></a>
                <p class="comments-counter">Comments: ${hero.commentsCount}</p>
                <div class="modal-box">
                </div>
            </div>
        `;   
        box.insertAdjacentHTML('beforeend', heroHTML);
    } 
});

// add hero comments into modal window
// function modalBox()
// fetch(`http://localhost:3500/api/heroes/${id}/comments`, {
//     method: "GET",
//     headers: {
//         "Content-Type": "application/json"
//     }
// })
// .then(async (response) => {
//     let res = await response.json();
//     const box = document.querySelector(".modal-card");
//     for (let i in res) {
//         let card = res[i];
//         const date = new Date(user.date);
//         const options = {
//           year: "numeric",
//           month: "short",
//           day: "numeric",
//           hour: "numeric",
//           minute: "numeric",
//           timeZone: "UTC",
//         };
//         const formattedDate = date.toLocaleDateString("en-US", options);
//         let cardHTML = `
//             <div id="${card._id}" class="modal-card">
//                 <p class="display-date">${formattedDate}</p>
//                 <p class="display-sender">${card.name}</p>
//                 <p class="display-comment">${card.comment}</p>
//                 <a class="btn-remove-comment")></a>
//             </div>
//         `;
//         box.insertAdjacentHTML("beforeend", cardHTML);
//     }
// })

// selectable btn for delete card
function removeHeroCard(_id, event) {
    event.stopPropagation();
    if (!confirm("Are you sure you want to remove hero?")) {
        return
    } else {
        fetch(`http://localhost:3500/api/heroes/${_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(async (response) => {
            if (response.ok) {
                document.getElementById(_id).remove();
            } 
        })
    }
}
