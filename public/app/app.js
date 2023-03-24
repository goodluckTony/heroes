
const form = document.querySelector('.container');
const formMessage = document.querySelector('.form-condition');

function heroHandler(e) {
    e.preventDefault();
    const name = form.name.value;
    const age = form.age.value;
    const power = form.power.value;
    const gender = form.gender.value;
    const btn = document.querySelector('.form-btn');

    const photo = document.querySelector('.photo-input');
    const photoReader = new FileReader();
    photoReader.readAsDataURL(photo.files[0]);
    photoReader.onload = function() {
        const photoData = photoReader.result.split(',')[1];

        fetch("http://localhost:3500/api/heroes", {
            method:'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                photo: photoData,
                name: name,
                power: power,
                age: age,
                gender: gender
            })
        })
        .then(async (response) => {
            let res = await response.json();
            if (response.status === 400) {
                formMessage.innerHTML = `${res.errorMessage}`;
            } else {
                // routing to hew hero details page
                formMessage.innerHTML = 'Hero successfully created';
                window.location.href = `http://localhost:3500/hero-details.html?id=${res.id}`;
            }
        })
    }
};
form.addEventListener('submit', heroHandler);

// photo uploader
    const photoInput = document.querySelector(".photo-input");
    let uploadedPhoto = "";
    photoInput.addEventListener("change", function() {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            uploadedPhoto = reader.result;
            document.querySelector('.photo-display').style.backgroundImage = `url(${uploadedPhoto})`;
        });
        reader.readAsDataURL(this.files[0]);
    });

// age range restrictions
    // const ageInput = document.querySelector('.age');
    // ageInput.onkeydown = function(event) {
    //     const keyCode = event.keyCode || event.which;
    //     if (keyCode === 8 || keyCode === 46) {
    //         return true;
    //     }
    //     if (keyCode >= 48 || keyCode <=57) {
    //         return true;
    //     } 
    //     event.preventDefault();
    // }
    
    // ageInput.addEventListener('input', function() {
    //     if (this.value < 0) {
    //         this.value = "";
    //     }
    // });   