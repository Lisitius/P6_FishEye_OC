//recupere id
const searchParams = new URLSearchParams(location.search);
const photographerId = +searchParams.get("id");
let orderBy = "pop";
let photographer;
let medias;
const photograph_media = document.querySelector("#photograph-media");
const orderDropdown = document.querySelector("#orderDropdown");
const likes = [];

//fetch json
(async () => {
  try {
    const res = await fetch("./data/photographers.json");
    const data = await res.json();
    console.log(data);

    photographer = data.photographers.find(
      (photographer) => photographer.id === photographerId
    );

    medias = data.media.filter(
      (media) => media.photographerId === photographerId
    );

    photograph_media.style.gridTemplateRows =
      "repeat(" + Math.ceil(medias.length / 3) + ", 400px)";

    console.log(photographer);
    dropdownMedia(photographer);
    headerProfile(photographer);
    showLikePrice(medias, photographer.price);
    nameContactModal();

    orderDropdown.onchange = ({ target: { value } }) =>
      dropdownMedia(photographer, value);
  } catch (err) {
    console.error(err);
    alert("Erreur !");
  }
})();

function headerProfile(photographer) {
  const { name, city, country, tagline, portrait } = photographer;
  const nameProfile = document.querySelector(".photograph-infos > h1");
  const locProfile = document.querySelector(
    ".photograph-infos > p:nth-child(2)"
  );
  const tagProfile = document.querySelector(".photograph-infos > p:last-child");
  const header = document.querySelector(".photograph-header");
  const img = document.createElement("img");

  nameProfile.textContent = name;
  locProfile.textContent = city + " ," + country;
  tagProfile.textContent = tagline;
  img.src = `./assets/photographers/${portrait}`;
  img.alt = photographer.name;
  console.log(img);
  header.appendChild(img);
}

// show like and price of photograph
function showLikePrice(medias, price) {
  const e = document.querySelector(".photograph-likeprice");

  e.children[0].textContent =
    medias.reduce((sum, media) => sum + media.likes, 0) + " ♥";
  e.children[1].textContent = price + "€ / jour";
}

function dropdownMedia(photographer, orderBy = "pop") {
  switch (orderBy) {
    //sort by popularity
    case "pop": {
      medias.sort((a, b) => b.likes - a.likes);
      break;
    }
    //sort by date
    case "date": {
      medias.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      break;
    }
    //sort by title
    case "title": {
      medias.sort((a, b) => a.title.localeCompare(b.title));
      break;
    }
  }
  //call fonction
  showMedia(photographer, medias);
}

function showMedia(photographer, medias) {
  const mediasPhoto = document.getElementById("photograph-media");
  mediasPhoto.innerHTML = "";

  for (const media of medias) {
    const article = document.createElement("article");
    const link = document.createElement("a");
    const typeMedia = media.video
      ? document.createElement("video")
      : document.createElement("img");
    const infosDiv = document.createElement("div");
    const nameSpan = document.createElement("span");
    const likeSpan = document.createElement("span");
    // add attribute
    article.dataset.id = media.id;
    link.href = "#";
    typeMedia.src = `./assets/images/${photographer.name}/${
      media.video ?? media.image
    }`;
    typeMedia.alt = media.title;
    typeMedia.controls = false;
    typeMedia.autoplay = false;

    nameSpan.textContent = media.title;
    likeSpan.textContent = media.likes + " ♥";

    likeSpan.onclick = ({ target }) => {
      const totalLikes = document.querySelector(
        ".photograph-likeprice > span:first-child"
      );

      if (target.classList.contains("liked")) {
        console.log(target);
        target.classList.remove("liked");
        // string to number
        totalLikes.textContent = parseInt(totalLikes.textContent) - 1 + " ♥";
        //decrement number of like
        target.textContent = parseInt(target.textContent) - 1 + " ♥";
      } else {
        // string to number
        target.classList.add("liked");
        totalLikes.textContent = parseInt(totalLikes.textContent) + 1 + " ♥";
        //increment number of like
        target.textContent = parseInt(target.textContent) + 1 + " ♥";
      }

      //add mediaid in table
      likes.push(media.id);
    };

    link.appendChild(article);
    article.appendChild(typeMedia);
    article.appendChild(infosDiv);
    infosDiv.appendChild(nameSpan);
    infosDiv.appendChild(likeSpan);
    mediasPhoto.appendChild(link);
  }
}

function nameContactModal() {
  const contactTitle = document.querySelector("#contact_modal h2");
  contactTitle.textContent += " " + photographer.name;
}
