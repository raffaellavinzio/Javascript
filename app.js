// url for dino.json - TO BE CHANGED AS NEEDED
const url = "http://localhost:5500/dino.json"

// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
  this.image = `./images/${this.species.toLowerCase().replace(" ", "%20")}.png`;
}

// Create Dino Objects
const getDinos = async () => {
  try {
    let response = await fetch(url);
    let data = await response.json();
    return data.Dinos.map(dino => new Dino(...Object.values(dino)));
  } catch (error) {
    alert(error);
  }
};

// Create Human Object
function Human(name, weight, height, diet) {
  this.species = name;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.image = "./images/human.png";
}

// Use IIFE to get human data from form
let getHuman = () =>
  (() => {
    const name = document.getElementById("name").value;
    const weight = document.getElementById("weight").value;
    const feet = document.getElementById("feet").value;
    const inches = document.getElementById("inches").value;
    const diet = document.getElementById("diet").value;

    return new Human(name, weight, feet * 12 + inches, diet);
  })();

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareWeight = function (human) {
  return this.weight >= human.weight
    ? `${this.species} is heavier than ${human.species}`
    : `${this.species} is lighter than ${human.species}`;
};

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareHeight = function (human) {
  return this.height >= human.height
    ? `${this.species} is taller than ${human.species}`
    : `${this.species} is shorter than ${human.species}`;
};

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareDiet = function (human) {
  return this.weight === human.diet
    ? `${this.species} and ${human.species} have the same diet`
    : `${this.species} and ${human.species} have different diets`;
};

// Generate Tiles for each Dino in Array
const generateRandomFact = (dino, human) => {
  const facts = [
    dino.fact,
    dino.compareHeight(human),
    dino.compareWeight(human),
    dino.compareDiet(human),
  ];
  return dino.species === "Pigeon"
    ? dino.fact
    : facts[Math.floor(Math.random() * facts.length)];
};

const generateTiles = async human => {
  const dinos = await getDinos();
  let html = dinos.map(
    dino =>
      `<div class="grid-item">
      <h3>${dino.species}</h3>
      <p>${generateRandomFact(dino, human)}</p>
      <img src=${dino.image} />
    </div>`
  );
  html.splice(
    4,
    0,
    `<div class="grid-item">
  <h3>${human.species}</h3>
  <img src=${human.image} />
</div>`
  );
  return html.join("");
};

// Add tiles to DOM
const addTiles = async human => {
  const grid = document.getElementById("grid");
  grid.innerHTML = await generateTiles(human);
};

// Remove form from screen
const removeForm = () => {
  const form = document.getElementById("dino-compare");
  form.style.display = "none";
};

// On button click, prepare and display infographic
const btn = document.getElementById("btn");
btn.addEventListener("click", function (e) {
  e.preventDefault();
  let human = getHuman();
  removeForm();
  addTiles(human);
});
