let name = document.querySelector(".name");
let age = document.querySelector(".age");
let power = document.querySelector(".power");
let hero = document.querySelector(".hero-box");
let gender = document.querySelector(".gender");
const url = new URL(window.location.href);
const id = url.searchParams.get("id");

let photo = document.querySelector(".hero-photo");

fetch(`http://localhost:3500/api/heroes/${id}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
}).then(async (response) => {
  let res = await response.json();

  if (!response.ok) {
    throw new Error`${response.status}`();
  } else {
    // console.log(typeof res.img);
    console.log(`${res.img} its src`);

    photo.src = `${res.img}`;
    name.innerHTML = `${res.name}`;
    age.innerHTML = `${res.age}`;
    power.innerHTML = `${res.power}`;
    gender.innerHTML = `${res.gender}`;
    // return console.log(`hero name is ${res.name.toUpperCase()} with id ${id}`);
  }
});

fetch(`http://localhost:3500/api/heroes/${id}/comments`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  }
}).then(async (response) => {
  let res = await response.json();
  const box = document.querySelector(".comment-box");

  for (let i in res) {
    let user = res[i];
    const date = new Date(user.date);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "UTC",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    let userHTML = `
            <div id="${user._id}" class="user-box">
                <p class="display-date">${formattedDate}</p>
                <p class="display-sender">${user.name}</p>
                <p class="display-comment">${user.comment}</p>
                <a class="btn-remove-comment" onclick="removeHeroComment('${user._id}', '${user.heroId}')"></a>
            </div>
        `;
    box.insertAdjacentHTML("afterbegin", userHTML);
  }
});

function removeHero() {
  if (!confirm("Are you sure you want to remove hero?")) {
    return;
  } else {
    fetch(`http://localhost:3500/api/heroes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (response.ok) {
        window.location.href = "http://localhost:3500/hero-list.html";
      }
    });
  }
}

function toHeroList() {
  document.querySelector(".btn-heroList").addEventListener("click", () => {
    window.location.href = "http://localhost:3500/hero-list.html";
  });
}

// create user comment add to db
function comment() {
  const name = document.querySelector(".sender").value;
  const comment = document.querySelector(".comment").value;
  fetch(`http://localhost:3500/api/heroes/${id}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      comment: comment,
    }),
  }).then(async (response) => {
    const box = document.querySelector(".comment-box");
    const date = new Date();
    let res = await response.json();
    if (response.status === 404) {
      //
      throw console.error(`${res.errorMessage}`);
    } else {
      let userHTML = `
          <div id="${res._id}" class="user-box">
              <p class="display-date">${date}</p>
              <p class="display-sender">${name}</p>
              <p class="display-comment">${comment}</p>
              <a class="btn-remove-comment" onclick="removeHeroComment('${res._id}', '${res.heroId}')"></a>
          </div>
      `;
      box.insertAdjacentHTML("afterbegin", userHTML);
    }
  });
  const inputFields = document.querySelectorAll("input[type='text']");;
  inputFields.forEach(i => {
    i.value = i.defaultValue;
  })
  // window.location.reload();
}

//remove comment by id when click on cross-btn
function removeHeroComment(_id, heroId) {
  if (!confirm("Are you sure you want to remove comment?")) {
    return
  } else {
    fetch(`http://localhost:3500/api/heroes/${heroId}/comments/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(async(response) => {
      if (response.ok) {
        document.getElementById(_id).remove();
      }
    })
  }
}

  


const inputFields = document.querySelectorAll("input[type='text']");
inputFields.forEach(function (inputField) {
  let initialValue = inputField.value;

  inputField.addEventListener("click", function () {
    inputField.value = "";
  });

  inputField.addEventListener("blur", function () {
    if (inputField.value === "") {
      inputField.value = initialValue;
    }
  });
});
