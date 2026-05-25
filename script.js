const locations = {

    Gerbang: [-3.7595, 102.2720],

    Rektorat: [-3.7585, 102.2730],

    Teknik: [-3.7575, 102.2740],

    Perpustakaan: [-3.7568, 102.2735],

    Masjid: [-3.7560, 102.2745]
};


// MEMBUAT MAP
const map = L.map('map').setView(
    [-3.7580, 102.2735],
    16
);


// TILE MAP
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '© OpenStreetMap'
    }
).addTo(map);


// MARKER
for(let place in locations){

    L.marker(locations[place])
        .addTo(map)
        .bindPopup(place);
}


// DATA GRAPH
const graph = {

    Gerbang: {
        Rektorat: 200
    },

    Rektorat: {
        Gerbang: 200,
        Teknik: 150,
        Perpustakaan: 100
    },

    Teknik: {
        Rektorat: 150,
        Masjid: 120
    },

    Perpustakaan: {
        Rektorat: 100,
        Masjid: 80
    },

    Masjid: {
        Teknik: 120,
        Perpustakaan: 80
    }
};


let line;


// ALGORITMA DIJKSTRA
function dijkstra(graph, start, end){

    const distances = {};
    const previous = {};
    const visited = new Set();

    for(let node in graph){
        distances[node] = Infinity;
    }

    distances[start] = 0;

    while(true){

        let closestNode = null;

        for(let node in distances){

            if(
                !visited.has(node) &&
                (
                    closestNode === null ||
                    distances[node] < distances[closestNode]
                )
            ){
                closestNode = node;
            }
        }

        if(closestNode === end) break;

        if(closestNode === null) break;

        visited.add(closestNode);

        for(let neighbor in graph[closestNode]){

            let newDistance =
                distances[closestNode] +
                graph[closestNode][neighbor];

            if(newDistance < distances[neighbor]){

                distances[neighbor] = newDistance;

                previous[neighbor] = closestNode;
            }
        }
    }

    const path = [];

    let current = end;

    while(current){

        path.unshift(current);

        current = previous[current];
    }

    return {
        distance: distances[end],
        path: path
    };
}


// CARI RUTE
function cariRute(){

    const start =
        document.getElementById("start").value;

    const end =
        document.getElementById("end").value;

    const result =
        dijkstra(graph, start, end);


    // HAPUS GARIS LAMA
    if(line){
        map.removeLayer(line);
    }


    // BUAT GARIS RUTE
    const routeCoordinates = result.path.map(
        place => locations[place]
    );

    line = L.polyline(
        routeCoordinates,
        {
            color:'red',
            weight:5
        }
    ).addTo(map);


    map.fitBounds(line.getBounds());


    document.getElementById("hasil").innerHTML =

        `
        Rute Terpendek:
        <br><br>

        ${result.path.join(" → ")}

        <br><br>

        Total Jarak:
        ${result.distance} meter
        `;
}