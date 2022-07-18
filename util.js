export async function postSelection(location, arr) {
  location.innerHTML = "";

  arr.map((pokemon) => {
    const item = document.createElement("option");
    item.label = `${pokemon.name}`;
    item.value = pokemon.id;
    location.appendChild(item);
  });
}

export async function receiveAllPokemonObjects() {
  let allPokemon = [];

  for (let i = 1; i < 899; i++) {
    const urls = [
      `https://pokeapi.co/api/v2/pokemon-species/${i}`,
      `https://pokeapi.co/api/v2/pokemon/${i}`,
    ];

    const calls = urls.map(async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    });

    const allData = await Promise.allSettled(calls)
      .then((responses) => {
        const data1 = (({ generation, id, name, varieties }) => ({
          generation,
          id,
          name,
          varieties,
        }))(responses[0].value);

        const data2 = (({ abilities, forms, sprites, stats, types }) => ({
          abilities,
          forms,
          sprites,
          stats,
          types,
        }))(responses[1].value);

        const dataCombined = Object.assign(data1, data2);
        allPokemon.push(dataCombined);
      })
      .catch((error) => console.log(error));
  }
  return allPokemon;
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
