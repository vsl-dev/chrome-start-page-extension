const clock = document.getElementById("clock");
const hours = document.getElementById("hours");
const dial = document.getElementById("dial");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const milliseconds = document.getElementById("milliseconds");
const bubble = document.getElementById("bubble");
const sun = document.getElementById("sun");
const moon = document.getElementById("moon");
const searchBarSection = document.getElementById("searchBarSection");
const favoritesModal = document.getElementById("favoritesModal");
const favoritesModalBg = document.getElementById("favoritesModalBg");
const newFavForm = document.getElementById("newFavForm");
const searchForm = document.getElementById("searchForm");
const favListDiv = document.getElementById("favListDiv");
const addNewFavBtn = document.getElementById("addNewFavBtn");
const versionNumber = document.getElementById("versionNumber");

versionNumber.textContent = "v" + chrome.runtime.getManifest().version;

const months = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

var favList = [];

const addNewFav = ({ title, url }) => {
  const newFav = {
    title: title,
    url: url,
    added: Date.now(),
  };

  const getLocalData =
    localStorage.getItem("fav_list") === null
      ? []
      : JSON.parse(localStorage.getItem("fav_list"));

  favList = getLocalData;

  favList.push(newFav);

  localStorage.setItem("fav_list", JSON.stringify(favList));
};

const loadFavList = () => {
  [...favListDiv.querySelectorAll("a[fav-element]")].forEach((x) => x.remove());
  const getLocalData =
    localStorage.getItem("fav_list") === null
      ? []
      : JSON.parse(localStorage.getItem("fav_list"));

  if (getLocalData.length !== 0) {
    if (getLocalData.length >= 12) {
      addNewFavBtn.classList.toggle("hidden");
    }

    getLocalData.forEach((x) => {
      const a = document.createElement("a");
      const img = document.createElement("img");
      const p = document.createElement("p");

      a.style.transition = "background-color 400ms, border-color 400ms";
      a.style.boxShadow = "2px 2px 2px #0000001a;";
      a.classList.add(
        "flex",
        "flex-col",
        "items-center",
        "p-1",
        "w-[74px]",
        "h-[74px]",
        "rounded-[6px]",
        "items-center",
        "backdrop-blur-[3px]",
        "bg-[#ffffff0d]",
        "border-[#ffffff1a]",
        "border-[1px]",
        "border-solid",
        "relative",
        "hover:bg-[#ffffff1a]",
        "hover:border-[#ffffff33]"
      );
      var getUrl;
      try {
        getUrl = "https://" + new URL(x.url).hostname + "/";
      } catch (err) {
        // console.error("Error:", err);
        getUrl = "https://" + x.url + "/";
      }
      a.href = getUrl;
      a.setAttribute("fav-element", "");
      img.src = `chrome://favicon/size/64@1x/${getUrl}`;
      img.width = 50;
      img.height = 50;
      a.appendChild(img);
      p.classList.add("text-center");
      p.textContent =
        x.title.length >= 10
          ? x.title.split("").slice(0, 9).join("") + "..."
          : x.title;
      a.appendChild(p);
      favListDiv.insertBefore(a, addNewFavBtn);
    });
  }
};

const updateClock = (t) => {
  const time = new Date(t ? t : Date.now());
  hours.textContent =
    time.getHours() <= 9 ? "0" + time.getHours() : time.getHours();
  minutes.textContent =
    time.getMinutes() <= 9 ? "0" + time.getMinutes() : time.getMinutes();
  seconds.textContent =
    time.getSeconds() <= 9 ? "0" + time.getSeconds() : time.getSeconds();
  milliseconds.textContent = time.getMilliseconds();

  const isDayTime = hours.textContent > 6 && hours.textContent < 19;

  if (isDayTime) {
    moon.classList.add("hidden");
    sun.classList.remove("hidden");
    bubble.style.background = "#facc15";
  } else {
    sun.classList.add("hidden");
    moon.classList.remove("hidden");
    bubble.style.background = "#a8a29e";
  }
};

setInterval(updateClock, 1);

addNewFavBtn.onclick = () => {
  favoritesModal.classList.toggle("hidden");
};

favoritesModalBg.addEventListener("click", () => {
  favoritesModal.classList.toggle("hidden");
});

newFavForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formdata = new FormData(newFavForm);

  const json = {
    title: formdata.get("title"),
    url: formdata.get("url"),
  };

  addNewFav(json);
  loadFavList();
  favoritesModal.classList.toggle("hidden");
});

updateClock();
loadFavList();
