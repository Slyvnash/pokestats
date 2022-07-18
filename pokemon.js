export default class Pokemon {
  constructor(data) {
    Object.assign(this, data);
  }

  getHtml(location) {
    const image = document.createElement("img");
    image.src = this.sprites.other["official-artwork"].front_default;

    const pokeName = document.createElement("h3");
    pokeName.textContent = this.name;

    const typeHeader = document.createElement("h4")
    typeHeader.textContent = "Type:"

    const type = document.createElement("p");
    type.textContent =
      this.types.length > 1
        ? `
        ${this.types[0].type.name} / ${this.types[1].type.name}`
        : this.types[0].type.name;

        const abilityHeader = document.createElement("h4")
        abilityHeader.textContent = "Abilities:"
    const abilities = document.createElement("p");
    for(let item of this.abilities) {
        if(this.abilities.indexOf(item) < this.abilities.length - 1) {
            abilities.textContent += `${item.ability.name.replaceAll("-", " ")} / `; 
        } else {
            abilities.textContent += `${item.ability.name.replaceAll("-", " ")}`;
          }
    }

    const infoBlock = document.createElement("div")
    infoBlock.append(image, pokeName, typeHeader, type, abilityHeader, abilities)

    const statsBlock = document.createElement("div")
    statsBlock.classList.add("stats-block")
    
    const statTitles = document.createElement("div")
    statTitles.classList.add("stat-titles")
    for (let item of this.stats) {
        const statName = document.createElement("div")
        statName.textContent = `${item.stat.name.replaceAll("-", " ")}: ${item.base_stat}`
        statTitles.append(statName)
    }

    const progBlock = document.createElement("div")
    progBlock.classList.add("prog-block")
    for(let item of this.stats) {
        const statItem = document.createElement("div")
        const percent = (item.base_stat / 260) * 100
        statItem.innerHTML = `
        <div class="stats-outer">
            <div class="stats-inner" style="width: ${percent}%;">
            </div>
        </div>`
        progBlock.append(statItem)
    }

    statsBlock.append(statTitles, progBlock)
    location.append(infoBlock, statsBlock);
  }
}
