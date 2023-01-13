//fetch data from photographers.json
async function getPhotographers() {
  try {
    const res = await fetch("./data/photographers.json");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
//end fetch data

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    // eslint-disable-next-line no-undef
    const photographerModel = photographerFactory(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
