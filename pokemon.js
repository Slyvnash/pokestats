export default class Pokemon {
  constructor(data) {
    Object.assign(this, data);
  }

  getHtml(location) {
    const pokeCardHTML = document.importNode(
      document.getElementById("pokemon-card-template").content,
      true
    );


    const icon = 
      (this.sprites.versions["generation-vii"].icons.front_default) ? 
        this.sprites.versions["generation-vii"].icons.front_default :
        this.sprites.versions["generation-viii"].icons.front_default

    pokeCardHTML.getElementById("pokemon-img").setAttribute("src",
      this.sprites.other["official-artwork"].front_default);
    pokeCardHTML.getElementById("pokemon-icon").setAttribute("src", icon)

    pokeCardHTML.getElementById("name").textContent = this.name;
    pokeCardHTML.getElementById("type-list").textContent =
      this.types.length > 1
        ? `
        ${this.types[0].type.name} / ${this.types[1].type.name}`
        : this.types[0].type.name;

    for (let item of this.abilities) {
      if (this.abilities.indexOf(item) < this.abilities.length - 1) {
        pokeCardHTML.getElementById(
          "abilities-list"
        ).textContent += `${item.ability.name.replaceAll("-", " ")} / `;
      } else {
        pokeCardHTML.getElementById(
          "abilities-list"
        ).textContent += `${item.ability.name.replaceAll("-", " ")}`;
      }
    }

    for (let item of this.stats) {
      const statLineHTML = document.importNode(
        document.getElementById("stats-line").content,
        true
      );
      statLineHTML.getElementById(
        "stat-name-val"
      ).textContent = `${item.stat.name.replaceAll("-", " ")}: `;
      statLineHTML.getElementById("stat-num-val").textContent = `${item.base_stat}`;
      statLineHTML
        .getElementById("stat-bar-inner")
        .setAttribute("style", `width: ${(item.base_stat / 260) * 100}%`);
      pokeCardHTML.getElementById("stats-block").appendChild(statLineHTML);
    }

    location.append(pokeCardHTML);
  }
}
