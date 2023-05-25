'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map;
let mapEvent;
let workouts = [];

//CLASSES
class Workout {
    date = new Date();
    id =(Date.now() + '').slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }
}

//CHILD CLASSES : RUNNING
class Running extends Workout {
    type = "Running";

    constructor (coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this.setDescription();
    }

    calcPace() {
        // (min/km)
        this.pace = this.duration / this.distance;
        return this.pace;
    }

    setDescription() {
        this.description = `${this.type} on ${this.date.toDateString()}`;
    }
}

//CHILD CLASSES : CYCLING
class Cycling extends Workout {
    type = "Cycling";

    constructor (coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevation = elevationGain;
        this.calcSpeed();
        this.setDescription()
    }

    calcSpeed() {
        // (km/h)
        this.speed = this.distance / (this.duration / 60 );
    }

    setDescription() {
        this.description = `${this.type} on ${this.date.toDateString()}`;
    }
}

// const run1 =new Running([39, -12],5.2,24,178);
// const cycling1 =new Cycling([39, -12],27,95,523);
// console.log(run1, cycling1)


navigator.geolocation.getCurrentPosition(
    function (position) {
        // console.log(position);
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        console.log(`https://www.google.com/maps/@${latitude},${longitude},14z`)

        const coords = [latitude, longitude]

        map = L.map('map').setView(coords, 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        //task 7.2
        const data = JSON.parse(localStorage.getItem("workout"))

        if (data) {
            workouts = data;
            console.log(data);
        }


        // L.marker(coords).addTo(map)
        //     .bindPopup('A pretty CSS popup.<br> Easily customizable.')
        //     .openPopup();

        map.on('click', function(mapE) {
            mapEvent=mapE;
            const lat= mapEvent.latlng.lat
            const lng= mapEvent.latlng.lng
            console.log(mapEvent)           
            form.classList.remove('hidden');
            inputDistance.focus();
        })
    },
    function () {
        alert("Could not get position.");
    }
)

form.addEventListener('submit', function (e) {
    e.preventDefault()

    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    const lat= mapEvent.latlng.lat
    const lng= mapEvent.latlng.lng
    let workout;

    if (type == 'running') {
        const cadence = Number(inputCadence.value);


        workout= new Running([lat,lng],distance,duration,cadence)
    }

    if (type == 'cycling') {
        const elevation = +inputElevation.value;


        workout= new Cycling([lat,lng],distance,duration,elevation)
    }

    workouts.push(workout)
    console.log(workouts)

    localStorage.setItem("workouts", JSON.stringify(workouts));

    L.marker([lat, lng]).addTo(map)
                    .bindPopup(L.popup({
                        maxWidth:250,
                        minWidth:100,
                        autoClose:false,
                        closeOnClick:false,
                        className:'running-popup',
                    }))
                    .setPopupContent('Workout')
                    .openPopup();




let html;
for (let workout of workouts) {
    let lat = workout.coords[0];
    let lng = workout.coords[1];

    if (workout.type === "running") {
        html = `<li class="workout workout--running" data-id=${workout.id}>
<h2 class="workout__title">${workout.description}</h2>
<div class="workout__details">
  <span class="workout__icon">🏃‍♂️</span>
  <span class="workout__value">${workout.distance}</span>
  <span class="workout__unit">km</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⏱</span>
  <span class="workout__value">${workout.duration}</span>
  <span class="workout__unit">min</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⚡️</span>
  <span class="workout__value">${workout.pace}</span>
  <span class="workout__unit">min/km</span>
</div>
<div class="workout__details">
  <span class="workout__icon">🦶🏼</span>
  <span class="workout__value">${workout.cadence}</span>
  <span class="workout__unit">spm</span>
</div>
</li>`;

L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
        L.popup({
        maxWidth:250,
        minWidth:100,
        autoClose:false,
        closeOnClick:false,
        className:'running-popup',
        })
    )
    .setPopupContent('Workout')
    .openPopup();

}   else if (workout.type === "cycling") {
    html = `<li class="workout workout--cycling" data-id=${workout.id}>
<h2 class="workout__title">${workout.description}</h2>
<div class="workout__details">
  <span class="workout__icon">🚴‍♀️</span>
  <span class="workout__value">${workout.distance}</span>
  <span class="workout__unit">km</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⏱</span>
  <span class="workout__value">${workout.duration}</span>
  <span class="workout__unit">min</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⚡️</span>
  <span class="workout__value">${workout.speed}</span>
  <span class="workout__unit">km/h</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⛰</span>
  <span class="workout__value">${workout.elevation}</span>
  <span class="workout__unit">m</span>
</div>
</li>`;

L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
        L.popup({
        maxWidth:250,
        minWidth:100,
        autoClose:false,
        closeOnClick:false,
        className:'cycling-popup',
        })
    )
    .setPopupContent('Workout')
    .openPopup();


}

}
console.log(html);
form.insertAdjacentHTML("afterend",html);


document.getElementById("form").reset();
})

//Event Listener Toggle form input type change. 

inputType.addEventListener('change', function(){
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
 })
 
 containerWorkouts.addEventListener("click", function(e) {
    const workoutE1 = e.target.closest(".workout");

    if (!workoutE1) return;

    const workout = workouts.find((work) => work.id === workoutE1.dataset.id);

    map.setView(workout.coords, 13, {
        animate: true, 
        pan: {
            duration: 1,
        },
    });
 });