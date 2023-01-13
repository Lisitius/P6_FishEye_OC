//get id
const searchParams = new URLSearchParams(location.search);
const photographerId = +searchParams.get("id");
// eslint-disable-next-line no-unused-vars
let orderBy = "pop"; //initialize orderby by default on pop
let photographer;
let medias;

const lightbox = document.getElementById("mediaModal");
const main = document.querySelector("main");
const header = document.querySelector("header");
const photograph_media = document.querySelector("#photograph-media");
const orderDropdown = document.querySelector("#orderDropdown");
const likes = [];

//fetch json
(async () => {
  try {
    //wait answer of fetch request for photograph info
    const res = await fetch("./data/photographers.json");
    //wait anwser of json
    const data = await res.json();
    // give the information of the photographer and the media to the variable photographer and media
    photographer = data.photographers.find(
      (photographer) => photographer.id === photographerId
    );
    medias = data.media.filter(
      (media) => media.photographerId === photographerId
    );

    //calculates the number of media and their size on the grid
    photograph_media.style.gridTemplateRows = //define number of line on grid
      "repeat(" + Math.ceil(medias.length / 3) + ", 400px)"; //math.ceil round up

    //function of dropdown to sort the media
    dropdownMedia(photographer);
    //function to display photographer info
    headerProfile(photographer);
    //function to display the number of likes and the price of the photographer
    showLikePrice(medias, photographer.price);
    //function to display the name of the photographer in the contact modal
    nameContactModal();
    //function for use left and right arrow on modal
    pressKey();

    orderDropdown.onchange = ({ target: { value } }) =>
      dropdownMedia(photographer, value);
  } catch (err) {
    console.error(err);
    alert("Erreur !");
  }
})();

function headerProfile(photographer) {
  //retrieves the DOM elements that contain the photographer's info
  const { name, city, country, tagline, portrait } = photographer;
  const nameProfile = document.querySelector(".photograph-infos > h1");
  const locProfile = document.querySelector(
    ".photograph-infos > p:nth-child(2)"
  );
  const tagProfile = document.querySelector(".photograph-infos > p:last-child");
  const header = document.querySelector(".photograph-header");
  //create image element for photographer profile
  const img = document.createElement("img");
  //add attributes to elements
  nameProfile.textContent = name;
  locProfile.textContent = city + " ," + country;
  tagProfile.textContent = tagline;
  img.src = `./assets/photographers/${portrait}`;
  img.alt = photographer.name;
  console.log(img);
  //add to parents
  header.appendChild(img);
}

// show like and price of photograph
function showLikePrice(medias, price) {
  const e = document.querySelector(".photograph-likeprice");

  e.children[0].textContent =
    medias.reduce((sum, media) => sum + media.likes, 0) + " ♥";
  e.children[1].textContent = price + "€ / jour";
}

//sort the media
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
    //create element for media
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
    //create event for click et increment the number of like
    likeSpan.onclick = ({ target }) => {
      const totalLikes = document.querySelector(
        ".photograph-likeprice > span:first-child"
      );
      console.log(target);

      //if the media is already liked then decrement the like by 1 otherwise add 1 like
      if (target.classList.contains("liked")) {
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

    link.onclick = (e) => {
      e.preventDefault();

      if (e.target.classList.contains("liked")) return;
      //select last element of modal (empty div) and copy cloned photo (onclick)
      lightbox.children[lightbox.children.length - 1].appendChild(
        typeMedia.cloneNode()
      );
      lightbox.children[
        lightbox.children.length - 1
      ].children[0].controls = true;
      lightbox.children[lightbox.children.length - 1].appendChild(
        nameSpan.cloneNode(true)
      );
      //
      lightbox.style.display = "inherit";
      //allows helper tools (screen readers) to ignore the element when true and make it visible to helper tools when false
      main.setAttribute("aria-hidden", "true");
      header.setAttribute("aria-hidden", "true");
      lightbox.setAttribute("aria-hidden", "false");
    };
    //add element
    link.appendChild(article);
    article.appendChild(typeMedia);
    article.appendChild(infosDiv);
    infosDiv.appendChild(nameSpan);
    infosDiv.appendChild(likeSpan);
    mediasPhoto.appendChild(link);
  }
}

function changeMedia(direction) {
  //focus element of modal and delete span name of media
  const media = lightbox.children[lightbox.children.length - 1].children[0];
  lightbox.children[lightbox.children.length - 1].children[1].remove();

  //get the name of the current media
  //retrieves the value of the "src" attribute of the "media" element, divides this value into segments using "/" as separators, then retrieves the last element of the array which is the name of the media.
  const src = media.src.split("/").pop();
  const index = medias.indexOf(
    medias.find((el) => (el.video ?? el.image) === src)
  );
  //delete media
  media.remove();

  //if direction is left then newidex -1 else newindex + 1
  let newIndex = direction === "left" ? index - 1 : index + 1;
  //checks if the newIndex variable is less than 0 or greater than or equal to the length of the medias
  if (newIndex < 0) {
    newIndex = medias.length - 1;
  } else if (newIndex >= medias.length) {
    newIndex = 0;
  }
  //Creates a video or image element by checking the medias array at index newindex
  const element = medias[newIndex].video
    ? document.createElement("video")
    : document.createElement("img");
  //create a span
  const spanName = document.createElement("span");
  //set the source of the video or image item based on the video or image property of the item in the medias array at a given index.
  element.src = `./assets/images/${photographer.name}/${
    medias[newIndex].video ?? medias[newIndex].image
  }`;
  element.alt = medias[newIndex].title;
  spanName.textContent = medias[newIndex].title;

  //add element and spanName to parent
  lightbox.children[lightbox.children.length - 1].appendChild(element);
  lightbox.children[lightbox.children.length - 1].appendChild(spanName);
}

//function to put the name of the photographer in contact modal
function nameContactModal() {
  //get h2 title in modal contact
  const contactTitle = document.querySelector("#contact_modal h2");
  //put the name of the photographer next to the title h2
  contactTitle.textContent += " " + photographer.name;
}


function closeMediaModal() {
  //retrieve the last lightbox child element and replace all its HTML content with an empty string "".
  lightbox.children[lightbox.children.length - 1].innerHTML = "";

  lightbox.style.display = "none";
  document.body.style.overflow = "auto";
  main.setAttribute("aria-hidden", "false");
  header.setAttribute("aria-hidden", "false");
  lightbox.setAttribute("aria-hidden", "true");
}

function pressKey() {
  //uses the addEventListener method to add an event listener for the keydown event.
  addEventListener("keydown", (e) => {
    //checks if the display property of the lightbox element is set and if it is different from "none".
    if (lightbox.style.display && lightbox.style.display !== "none") {
      //checks if the left key is pressed if so call changeMedia("left")
      if (e.code === "ArrowLeft") {
        return changeMedia("left");
      }
      //checks if the right key is pressed if so call changeMedia("right")
      if (e.code === "ArrowRight") {
        return changeMedia("right");
      }
      //checks if the escape key is pressed if so call closeMediaModal()
      if (e.code === "Escape") {
        return closeMediaModal();
      }
    }
  });
}
