document.addEventListener("DOMContentLoaded", () => {
  const theatreSelect = document.getElementById("theatreSelect");
  const moviesContainer = document.getElementById("movies");


  fetch("https://www.finnkino.fi/xml/TheatreAreas/")
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => {
      const areas = data.getElementsByTagName("TheatreArea");
      for (let area of areas) {
        const id = area.getElementsByTagName("ID")[0].textContent;
        const name = area.getElementsByTagName("Name")[0].textContent;

        const option = document.createElement("option");
        option.value = id;
        option.textContent = name;
        theatreSelect.appendChild(option);
      }
    });

  theatreSelect.addEventListener("change", () => {
    const theatreId = theatreSelect.value;
    fetch(`https://www.finnkino.fi/xml/Schedule/?area=${theatreId}`)
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(data => {
        const shows = data.getElementsByTagName("Show");
        moviesContainer.innerHTML = "";

        const shownTitles = new Set();

        for (let show of shows) {
          const title = show.getElementsByTagName("Title")[0].textContent;
          const img = show.getElementsByTagName("EventSmallImagePortrait")[0].textContent;
          const startTime = show.getElementsByTagName("dttmShowStart")[0].textContent;

          if (shownTitles.has(title)) continue;
          shownTitles.add(title);

          const div = document.createElement("div");
          div.className = "movie";
          div.innerHTML = `
            <h3>${title}</h3>
            <img src="${img}" alt="${title}" />
            <p>Näytös alkaa: ${new Date(startTime).toLocaleString()}</p>
          `;
          moviesContainer.appendChild(div);

          
        }
      });
  });
});
const searchInput = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");

const API_KEY = "df730493";

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query.length < 3) return;

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") {
        searchResult.innerHTML = `
          <h2>${data.Title} (${data.Year})</h2>
          <img src="${data.Poster}" alt="${data.Title}" />
          <p>${data.Plot}</p>
        `;
      } else {
        searchResult.innerHTML = "<p>Ei tuloksia.</p>";
      }
    });
});
