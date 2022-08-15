import { postSelection, receiveAllPokemonObjects, renderComparison, buildList } from "./util.js";
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
const filterDropDownBtnEl = document.getElementById("collapse-filter")
const poke1DropDownBtnEl = document.getElementById("collapse-poke1")
const poke2DropDownBtnEl = document.getElementById("collapse-poke2")

const allData = await receiveAllPokemonObjects();
const allPokemon = Object.values(allData).map(item => new Pokemon(item));
let locArr1 = []
let locArr2 = []

/*/////////*/
/* ON LOAD */
/*/////////*/

//Create 2 starting pokemon on load
let pokemon1 = allPokemon[Math.floor(Math.random() * 898) + 1];
let pokemon2 = allPokemon[Math.floor(Math.random() * 898) + 1];

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
        item.innerText = name;
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
        item.innerText = num;
        genSelectEl.appendChild(item);
      });
  });

// Build Drop-Down Buttons
filterDropDownBtnEl.addEventListener("click",
  () => showHide(filterDropDownBtnEl, document.getElementById("filter-content")))
poke1DropDownBtnEl.addEventListener("click",
  () => showHide(poke1DropDownBtnEl, document.getElementById("poke1-content")))
poke2DropDownBtnEl.addEventListener("click",
  () => showHide(poke2DropDownBtnEl, document.getElementById("poke2-content")))

/*/////////////////*/
/* EVENT LISTENERS */
/*/////////////////*/

// Select Pokemon #1
pokemon1SelectEl.addEventListener("change", async (event) => {
  pokemon1DisplayEl.innerHTML = "";
  for (let pokemon of allPokemon) {
    if (parseInt(event.target.value) === pokemon.id) {
      pokemon1 = pokemon
    }
  }
  pokemon1.getHtml(pokemon1DisplayEl);
  renderComparison(pokemon1, pokemon2);
});

// Select Pokemon #2
pokemon2SelectEl.addEventListener("change", async (event) => {
  pokemon2DisplayEl.innerHTML = "";
  for (let pokemon of allPokemon) {
    if (parseInt(event.target.value) === pokemon.id) {
      pokemon2 = pokemon
    }
  }
  pokemon2.getHtml(pokemon2DisplayEl);
  renderComparison(pokemon1, pokemon2);
});

// Select Sort Method
for (const radioButton of radioGroup) {
  radioButton.addEventListener("change", (event) => {
    if (event.target.value === "name") {
      locArr1 = locArr1.sort((a, b) => {
        return (a.name > b.name) ? 1 : -1
      })
      locArr2 = locArr2.sort((a, b) => {
        return (a.name > b.name) ? 1 : -1
      })
        postSelection(pokemon1SelectEl, locArr1)
        postSelection(pokemon2SelectEl, locArr2)
    } else if (event.target.value === "dex") {
      locArr1 = locArr1.sort((a, b) => {
        return (a.id > b.id) ? 1 : -1
      })
      locArr2 = locArr2.sort((a, b) => {
        return (a.id > b.id) ? 1 : -1
      })
        postSelection(pokemon1SelectEl, locArr1)
        postSelection(pokemon2SelectEl, locArr2)
    }
  });
}

// Select Typing
typeSelectEl.addEventListener("change", (event) => {

  locArr1 = buildList(allPokemon, event.target.value,
    genSelectEl.value, pokemon1SearchEl.value)
  locArr2 = buildList(allPokemon, event.target.value,
    genSelectEl.value, pokemon2SearchEl.value)
  
  postSelection(pokemon1SelectEl, locArr1)
  postSelection(pokemon2SelectEl, locArr2)
});

// Select Generation
genSelectEl.addEventListener("change", (event) => {
  locArr1 = buildList(allPokemon, typeSelectEl.value,
    event.target.value, pokemon1SearchEl.value)
  locArr2 = buildList(allPokemon, typeSelectEl.value,
    event.target.value, pokemon2SearchEl.value)
  
  postSelection(pokemon1SelectEl, locArr1)
  postSelection(pokemon2SelectEl, locArr2)
});

// Search feature
pokemon1SearchEl.addEventListener("input", (event) => {
  console.log(locArr1)
  locArr1 = buildList(allPokemon, typeSelectEl.value,
    genSelectEl.value, event.target.value)
  console.log(locArr1)
    postSelection(pokemon1SelectEl, locArr1)
})

pokemon2SearchEl.addEventListener("input", (event) => {
  locArr2 = buildList(allPokemon, typeSelectEl.value,
    genSelectEl.value, event.target.value)
  
    postSelection(pokemon2SelectEl, locArr2)
})

//Drop Down Menu Buttons

function showHide(btnId, locId) {
  if (btnId.getAttribute("data-dropdown") === "true") {
    btnId.setAttribute("data-dropdown", "false")
    locId.setAttribute("data-visible", "true")
  } else {
    btnId.setAttribute("data-dropdown", "true")
    locId.setAttribute("data-visible", "false")
  }
}