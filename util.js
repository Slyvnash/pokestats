const API = "https://pokeapi.co/api/v2"
const TOTAL_POKEMON_COUNT = 898
const loadingScreen = document.getElementById("loader-screen")

const calls = []
let i;

for(i = 1; i<=TOTAL_POKEMON_COUNT; i++){
  calls.push(`${API}/pokemon/${i}`);
  calls.push(`${API}/pokemon-species/${i}`);
}


export async function postSelection(location, arr) {
  location.innerHTML = "";

  return arr.map((pokemon) => {
    const item = document.createElement("option");
    let icon = ""
    if (pokemon.sprites.versions["generation-vii"].icons.front_default) {
    icon = `background-image:url(${pokemon.sprites.versions["generation-vii"].icons.front_default})`
    } else {
      icon = `background-image:url(${pokemon.sprites.versions["generation-viii"].icons.front_default})`
    }
    item.setAttribute("style", icon)
    item.label = `${pokemon.name}`;
    item.value = pokemon.id;
    location.appendChild(item);
  });
}

function all(items, fn) {
  const promises = items.map(item => fn(item).then(data => data.json()));
  return Promise.all(promises);
}

function series(items, fn) {
  let result = [];
  return items
    .reduce((acc, item) => {
      acc = acc.then(() => {
        return fn(item).then(res => result.push(res));
      });
      return acc;
    }, Promise.resolve())
    .then(() => result);
}

function splitToChunks(items, chunkSize = 50) {
  const result = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    result.push(items.slice(i, i + chunkSize));
  }
  return result;
}
function chunks(items, fn, chunkSize = 50) {
  let result = [];
  const chunks = splitToChunks(items, chunkSize);
  return series(chunks, chunk => {
    return all(chunk, fn).then(res => (result = result.concat(res)));
  }).then(() => result);
}

export async function receiveAllPokemonObjects() {
  const allPokemon = await chunks(calls, fetch, 100);
  const pokemon = {};
 
  allPokemon.forEach(call => {
    pokemon[call.id] = { ...pokemon[call.id], ...call };
  })

  setTimeout(hideLoader, 500)

  return pokemon;
}

function hideLoader() {
  loadingScreen.classList.add("hidden")
  document.querySelector("main").classList.remove("hidden")
}

export function renderComparison(pokemon1, pokemon2) {
  const compareDisplayLoc = document.getElementById("comparison");
  const compareDisplayEl = document.createElement("div");
  compareDisplayEl.classList.add("compare-container")
  compareDisplayLoc.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const compareStat = document.createElement("div");
    const p1Greater = (pokemon1.stats[i].base_stat > pokemon2.stats[i].base_stat)
    const p2Greater = (pokemon2.stats[i].base_stat > pokemon1.stats[i].base_stat)
    const difference = Math.abs(pokemon1.stats[i].base_stat - pokemon2.stats[i].base_stat)
    // You should use a template for this
    compareStat.innerHTML = `
    ${p1Greater ? 
      "<img src='./images/up-arrow.svg'/>" : (!p1Greater && !p2Greater) ? 
      "<img src='./images/neutral.svg'/>" :
      "<img src='./images/down-arrow.svg'/>"} 
    ${difference}
    ${p2Greater ? 
      "<img src='./images/up-arrow.svg'/>" : (!p1Greater && !p2Greater) ? 
      "<img src='./images/neutral.svg'/>" :
      "<img src='./images/down-arrow.svg'/>"}`;
    compareDisplayEl.append(compareStat);
  }

  compareDisplayLoc.append(compareDisplayEl);
}
