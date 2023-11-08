document.addEventListener("DOMContentLoaded", () => {
    let map =  L.map('map', {
        minZoom: 6,
        maxZoom: 19
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }) .addTo(map); 
    map.setView([46.77084692888879, 2.6244369922816846], 0);
        // Récupérez les éléments HTML où vous voulez afficher les données JSON
        const titleBlockSocietes = document.getElementById('title_block_societes');
        const agencesContainer = document.getElementById('agences');
        let compteur = 0;
        let compteurAgencesAffichees = 0;

        agencesContainer.map = map;

        const villes = new Set();
        // Chargez les données JSON depuis le fichier
        fetch('bdd.json')
            .then(response => response.json())
            .then(data => {
                // Affichez le titre du bloc "title_block_societes"
                titleBlockSocietes.innerHTML = data.title_block_societes;

                // Affichez les informations des agences
                const agences = data.agence;
                //console.log(map)
                agences.forEach(agence => {
                  var marker = L.marker([agence.map.longitude, agence.map.latitude]).addTo(map);
                  villes.add(agence.ville);
                    const agenceDiv = document.createElement('div');
                    agenceDiv.classList.add('soccard', 'row');
                   agenceDiv.dataset.longitude = agence.map.longitude;
                    agenceDiv.dataset.latitude = agence.map.latitude;
                    let longitude = agenceDiv.dataset.longitude;
                    let latitude = agenceDiv.dataset.latitude;
                    agenceDiv.innerHTML = `
                    <div class="photo col-md-3">
                    <img src="${agence.photo}" alt="" title="">
                </div>
                <div class="infos col-md-9">
                <h4 class="nom">${agence.restaurant}</h4>
                <h4 class="ville">${agence.ville}</h4>
                <hr>
                <div class="coord row">
                    <p class="col-md-12"><i class="fa-solid fa-location-dot"></i>${agence.adresse}</p>
                    <p class="col-md-12"><i class="fas fa-phone"></i><a href="telto:${agence.telephone}">${agence.telephone}</a></p>
                    <p class="col-md-12"><i class="fa-solid fa-envelope"></i><a href="mailto:${agence.email}">${agence.email}</a></p>
                            </div>
                        </div>
                        <div id="map" class="mobile-map col-md-12">
                    </div>


                    `;
                    agencesContainer.appendChild(agenceDiv);

                    // Incrémentez le compteur à chaque création d'agence
                    compteur++;
                    // Mettez à jour le contenu de l'élément HTML du compteur
                    compteurAgences.textContent = compteur;

                    marker.bindPopup(`<img src="${agence.photo}" alt="" title=""><h4 class="nom">${agence.restaurant}</h4><h4 class="ville">${agence.ville}</h4><hr><div class="coord row"><p class="col-md-12"><i class="fa-solid fa-location-dot"></i>${agence.adresse}</p><p class="col-md-12"><i class="fas fa-phone"></i><a href="telto:${agence.telephone}">${agence.telephone}</a></p><p class="col-md-12"><i class="fa-solid fa-envelope"></i><a href="mailto:${agence.email}">${agence.email}</a></p></div>`);
                }, map);

                const villesArray = Array.from(villes);

                $(function recherche() {
                    $("#search").autocomplete({
                        source: villesArray
                    });
                });

/*

                // Écoutez les saisies dans le champ de recherche
$("#search").on("input", function() {
    const searchTerm = $(this).val().trim().toLowerCase();
    const agences = document.querySelectorAll('.soccard');

    agences.forEach(agence => {
        const ville = agence.querySelector('.ville').textContent.toLowerCase();
        if (ville.includes(searchTerm)) {
            agence.style.display = "flex";
        } else {
            agence.style.display = "none";
        }
    });
});

*/

// Écoutez les saisies dans le champ de recherche
$("#search").on("input", function() {
    const searchTerm = $(this).val().trim().toLowerCase();
    const agences = document.querySelectorAll('.soccard');
    compteurAgencesAffichees = 0;
    const searchCity = searchTerm;
    const distanceMax = 15000;

    agences.forEach(agence => {
        const ville = agence.querySelector('.ville').textContent.toLowerCase();
     /*   const latitude = parseFloat(agence.dataset.latitude);
        const longitude = parseFloat(agence.dataset.longitude);

        // Calcul de la distance en utilisant la formule Haversine
        const distance = calculateDistance(searchCity, latitude, longitude);*/

        if (ville.includes(searchTerm) || distance < distanceMax) {
            agence.style.display = "flex";
            compteurAgencesAffichees++;
        } else {
            agence.style.display = "none";
        }

        compteurAgences.textContent = compteurAgencesAffichees;
    });

    // Écoutez l'événement de sélection d'une suggestion
$("#search").on("autocompleteselect", function(event, ui) {
    const selectedCity = ui.item.value.toLowerCase();
    compteurAgencesAffichees = 0;
    // Filtrer les agences en fonction de la ville sélectionnée
    const agences = document.querySelectorAll('.soccard');
    agences.forEach(agence => {
        const ville = agence.querySelector('.ville').textContent.toLowerCase();
        if (ville === selectedCity) {
            agence.style.display = "flex";
            compteurAgencesAffichees++;
        } else {
            agence.style.display = "none";
        }

        compteurAgences.textContent = compteurAgencesAffichees;
    });
});
});
/*
function calculateDistance(searchCity, lat2, lon2) {
    // Coordonnées géographiques de la ville recherchée (par exemple, Paris)
    const cityCoordinates = cityCoordinatesMap[searchCity];
    if (!cityCoordinates) {
        return Infinity; // Ville inconnue, distance infinie
    }
    
    const lat1 = cityCoordinates.latitude;
    const lon1 = cityCoordinates.longitude;

    // Calcul de la distance en utilisant la formule Haversine
    const R = 6371; // Rayon de la Terre en km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Coordonnées géographiques des villes
const cityCoordinatesMap = {
    "paris": { latitude: 48.8566, longitude: 2.3522 }, // Exemple pour Paris
    "bordeaux": { latitude: 44.8377, longitude: -0.5791 },
    // Ajoutez les coordonnées d'autres villes au besoin
};*/

            })
            .catch(error => console.error('Erreur lors de la récupération des données :', error));

                // Écoutez les clics sur l'élément contenant les agences
    agencesContainer.addEventListener("click", (event) => {
        // Trouvez l'élément parent "soccard" en remontant dans la hiérarchie
        let target = event.target;
        while (target !== this && !target.classList.contains("soccard")) {
            target = target.parentElement;
        }
  
        if (target.classList.contains("soccard")) {
            // Retirez la classe "active" de tous les éléments "soccard"
            const soccards = agencesContainer.querySelectorAll(".soccard");
            soccards.forEach(function(soccard) {
                soccard.classList.remove("active");
            });
            // Ajoutez la classe "active" uniquement à l'élément cliqué
            target.classList.add("active");
            event.currentTarget.map.setView([target.dataset.longitude, target.dataset.latitude], 16);
          //  marker.openPopup(map);
          
          const column = document.querySelector(".column");
        target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        }
    });

    jQuery.ui.autocomplete.prototype._resizeMenu = function () {
        var ul = this.menu.element;
        ul.outerWidth(this.element.outerWidth());
      }

});

