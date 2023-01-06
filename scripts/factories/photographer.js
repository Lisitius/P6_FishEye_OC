function photographerFactory(data) {
  const { name, id, city, country, tagline, price, portrait } = data;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    //create element
    const article = document.createElement("article");
    const img = document.createElement("img");
    const link = document.createElement("a");
    const h2 = document.createElement("h2");
    const div = document.createElement("div");
    const infosLoc = document.createElement("p");
    const infosTag = document.createElement("p");
    const infosPrice = document.createElement("p");
    //define element
    link.href = "./photographer.html?id=" + id;
    link.ariaLabel = name;
    img.setAttribute("src", picture);
    img.alt = "Photo de " + name;
    h2.textContent = name;
    //add element to parents
    article.appendChild(link);
    article.appendChild(div);
    link.appendChild(img);
    link.appendChild(h2);
    div.appendChild(infosLoc);
    div.appendChild(infosTag);
    div.appendChild(infosPrice);
    //define content of element
    infosLoc.textContent = city + ", " + country;
    infosTag.textContent = tagline;
    infosPrice.textContent = price + " €/jour";
    //return element
    return article;
  }
  return { getUserCardDOM };
}
