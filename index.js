import { postSelection, receiveAllPokemonObjects, renderComparison } from "./util.js";
import Pokemon from "./pokemon.js";

const pokemon1SelectEl = document.getElementById("pokemon-1-select");
const pokemon2SelectEl = document.getElementById("pokemon-2-select");
const typeSelectEl = document.getElementById("type-select");
const genSelectEl = document.getElementById("generation-select");
const radioGroup = document.querySelectorAll('input[name="sort"]');
const pokemon1DisplayEl = document.getElementById("display").firstElementChild;
const pokemon2DisplayEl = document.getElementById("display").lastElementChild;
const pokemon1SearchEl = document.getElementById("pokemon-1-search")
const pokemon2SearchEl = document.getElementById("pokemon-2-search")

const allData = await receiveAllPokemonObjects()
const allPokemon = allData.map(item => new Pokemon(item));
/*/////////*/
/* ON LOAD */
/*/////////*/

//Create 2 starting pokemon on load
let pokemon1 = allPokemon[Math.floor(Math.random() * 898) + 1];
let pokemon2 = allPokemon[Math.floor(Math.random() * 898) + 1];
console.log(pokemon1)
//Build the HTML for each
pokemon1.getHtml(pokemon1DisplayEl);
pokemon2.getHtml(pokemon2DisplayEl);
renderComparison(pokemon1, pokemon2);

//Fill Selection Boxes
postSelection(pokemon1SelectEl, allPokemon);
postSelection(pokemon2SelectEl, allPokemon);

// Type List Selector
fetch("https://pokeapi.co/api/v2/type/?offset=0&limit=18")
  .then((res) => res.json())
  .then((data) => {
    data.results
      .map((item) => item.name)
      .map((name) => {
        const item = document.createElement("option");
        item.label = name;
        item.value = name;
        typeSelectEl.appendChild(item);
      });
  });

// Generation Selector
fetch("https://pokeapi.co/api/v2/generation")
  .then((res) => res.json())
  .then((data) => {
    data.results
      .map((item) => data.results.indexOf(item) + 1)
      .map((num) => {
        const item = document.createElement("option");
        item.label = num;
        item.value = num;
        genSelectEl.appendChild(item);
      });
  });

/*/////////////////*/
/* EVENT LISTENERS */
/*/////////////////*/

// Select Pokemon #1
pokemon1SelectEl.addEventListener("change", async (event) => {
  pokemon1DisplayEl.innerHTML = "";
  pokemon1 = allPokemon[event.target.value - 1]
  pokemon1.getHtml(pokemon1DisplayEl);
  renderComparison(pokemon1, pokemon2);
});

// Select Pokemon #2
pokemon2SelectEl.addEventListener("change", async (event) => {
  pokemon2DisplayEl.innerHTML = "";
  pokemon2 = allPokemon[event.target.value - 1];
  pokemon2.getHtml(pokemon2DisplayEl);
  renderComparison(pokemon1, pokemon2);
});

// Select Sort Method
for (const radioButton of radioGroup) {
  radioButton.addEventListener("change", (event) => {
    if (event.target.value === "name") {
      const nameArr = allPokemon.sort((a, b) => {
        return (a.name > b.name) ? 1 : -1})
        postSelection(pokemon1SelectEl, nameArr)
        postSelection(pokemon2SelectEl, nameArr)
      filterType(typeSelectEl.value, pokemon1SelectEl, pokemon2SelectEl)
      filterGen(genSelectEl.value, pokemon1SelectEl, pokemon2SelectEl)
    } else if (event.target.value === "dex") {
      const dexArr = allPokemon.sort((a, b) => {
        return (a.id > b.id) ? 1 : -1})
        postSelection(pokemon1SelectEl, dexArr)
        postSelection(pokemon2SelectEl, dexArr)
        filterType(typeSelectEl.value, pokemon1SelectEl, pokemon2SelectEl)
        filterGen(genSelectEl.value, pokemon1SelectEl, pokemon2SelectEl)
    }
  });
}

// Select Typing
typeSelectEl.addEventListener("change", (event) => {
  filterType(event.target.value, pokemon1SelectEl, pokemon2SelectEl)
});

// Select Generation
genSelectEl.addEventListener("change", (event) => {
  filterGen(event.target.value, pokemon1SelectEl, pokemon2SelectEl)
});

// Search feature
pokemon1SearchEl.addEventListener("input", (event) => {
  search(event.target.value, pokemon1SelectEl)})
pokemon2SearchEl.addEventListener("input", (event) => {
  search(event.target.value, pokemon2SelectEl)})

function search(text, location) {
  for (let i = 0; i < location.length; i++) {
    let child = location.children[i];
    if(child.label.toLowerCase().includes(text.toLowerCase())){
    child.classList.remove("wrong-name");
    } else {
      child.classList.add("wrong-name");
    }
  }
}

function filterType(value, location1, location2) {

  if (value != "Any") {
    for (let i = 0; i < location1.children.length; i++) {

      let child = location1.children[i];
      let child2 = location2.children[i];

      for (let pokemon of allPokemon) {
        let containsType = false;
        if (pokemon.name === child.label) {
          const types = pokemon.types.map((item) => item.type.name);
          containsType = types.includes(value);
          if (containsType) {
            child.classList.remove("wrong-type");
            child2.classList.remove("wrong-type");
          } else {
            child.classList.add("wrong-type");
            child2.classList.add("wrong-type");
          }
        }
      }
    }
  } else {
    for (let i = 0; i < location1.children.length; i++) {
      let child = location1.children[i];
      let child2 = pokemon2SelectEl.children[i];
      child.classList.remove("wrong-type");
      child2.classList.remove("wrong-type");
    }
  }

  search(pokemon1SearchEl.value, pokemon1SelectEl)
  search(pokemon2SearchEl.value, pokemon2SelectEl)
}

function filterGen(value, location1, location2) {
  if (value != "Any") {
    for (let i = 0; i < location1.children.length; i++) {
      let child = location1.children[i];
      let child2 = location2.children[i];

      for(let pokemon of allPokemon) {
        let containsGen = false;
        if(pokemon.name === child.label){
        const genArray = pokemon.generation.url.split("/")
        const genNum = genArray[genArray.length - 2]
        containsGen = (genNum === value)
        if(containsGen) {
          child.classList.remove("wrong-gen");
          child2.classList.remove("wrong-gen");
        } else {
          child.classList.add("wrong-gen");
          child2.classList.add("wrong-gen");
        }
        }
      }
    }
  } else {
    for (let i = 0; i < location1.children.length; i++) {
      let child = location1.children[i];
      let child2 = location2.children[i];
      child.classList.remove("wrong-gen");
      child2.classList.remove("wrong-gen");
    }
  }

  search(pokemon1SearchEl.value, pokemon1SelectEl)
  search(pokemon2SearchEl.value, pokemon2SelectEl)
}