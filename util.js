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
    item.innerText = `${pokemon.name}`
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
  compareDisplayLoc.innerHTML = ""

  const statTitles=["HP", "ATTK", "DEF", "SP ATTK", "SP DEF", "SPD"]

  for (let i = 0; i < 6; i++) {
    const compHTML = document.importNode(document.getElementById("comp-template").content, true)
    compHTML.getElementById("arrow-left").setAttribute("src", compareImage(i, pokemon1, pokemon2))
    compHTML.getElementById("val").textContent = valDif(i)
    compHTML.getElementById("comp-stat-title").textContent = statTitles[i]
    compHTML.getElementById("arrow-right").setAttribute("src", compareImage(i, pokemon2, pokemon1))
    compareDisplayLoc.appendChild(compHTML);
  }

  function compareImage(index, active, other) {
    const source = (active.stats[index].base_stat > other.stats[index].base_stat) ? './images/up-arrow.svg' :
    (other.stats[index].base_stat > active.stats[index].base_stat) ? './images/down-arrow.svg' :
    './images/neutral.svg'

    return source
  }

  function valDif(index) {
    return Math.abs(pokemon1.stats[index].base_stat - pokemon2.stats[index].base_stat)
  }
}

export function buildList(arr, typeVal, genVal, searchVal) {
  let tempArray = arr
  let newArray = []

  //Read type value and rebuild
  if (typeVal != "All") {
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i]) {
        const types = tempArray[i].types.map((item) => item.type.name);
        if (!(types.includes(typeVal))) {
          tempArray.splice(i, 1, null)
        }
      }
    }
  }

  //Read gen value and rebuild
  if (genVal != "All") {
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i]) {
        const genArr = tempArray[i].generation.url.split("/")
        const genNum = genArr[genArr.length - 2]

        if (genVal != genNum) {
          tempArray.splice(i, 1, null)
        }
      }
    }
  }

  //Read related search box and rebuild
  if (searchVal) {
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i] != null) {
        console.log(tempArray[i].name)
        if (!tempArray[i].name.toLowerCase().includes(searchVal.toLowerCase())) {
          tempArray.splice(i, 1, null)
        }
      } else {console.log("broken")}
    }
  }

  //Remove all incorrect pokemon from the array
  for (let i = 0; i < tempArray.length; i++) {
    if (tempArray[i] != null) {
      newArray.push(tempArray[i])
    }
  }

  return newArray
}