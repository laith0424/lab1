const create_form = document.getElementById("create_form");
const create_title = document.getElementById("create_title");
const create_artist = document.getElementById("create_artist");
const create_year = document.getElementById("create_year");
const album_err = document.getElementById("create_err");

function delete_album(ID){
    fetch(`/api/albums/${ID}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => {
        console.log(res);
    })
    create_table();
};

function update_album(ID, title_index, artist_index, year_index){
    const title = document.getElementById(title_index).innerHTML;
    const artist = document.getElementById(artist_index).innerHTML;
    const year = document.getElementById(year_index).innerHTML;
    const album_update = {
        title: title,
        artist: artist,
        year: year
    };
    fetch(`/api/albums/${ID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(album_update)
    })
    .then(res => res.json())
    .then(response => {
        console.log(JSON.stringify(response));
    });
};

function show_album(ID){
    fetch(`/api/albums/${ID}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(response => {
        document.getElementById("show_album").innerHTML = 
        `<h3>Details about album:</h3>
        <p>ID: ${response.ID}<br>
        title: ${response.title}<br>
        artist: ${response.artist}<br>
        year: ${response.year}</p>
        <h4>album data in Json format:<h4/>
        <p>${JSON.stringify(response)}</p>`
    });
};
function create_table(){
    fetch("/api/albums", {
        method: "GET",
        headers: {
            "Content-Type" : "application/json"
        }
    })
    .then(res => res.json())
    .then(response => {
        var col = [];
        for (let i = 0; i < response.length; i++){
            for (let key in response[i]){
                if (key == "_id" || key == "__v"){
                    continue;
                }
                if (col.indexOf(key) === -1){
                    col.push(key);
                }
            }
    
        }
        var table = document.createElement("table");
        var tr = table.insertRow(-1);
        for (let i = 0; i < col.length; i++){
            let th = document.createElement("th");
            th.innerHTML = col[i];
            tr.appendChild(th);
        }
        for (let i = 0; i < response.length; i++){
            tr = table.insertRow(-1);
            for (let j = 0; j < col.length; j++){
                let tabCell = tr.insertCell(-1);
                tabCell.innerHTML = response[i][col[j]];
                if (j != 0){
                    tabCell.setAttribute("contenteditable", "true");
                }
                tabCell.id = `${i}${j}`;
            }
            var tabCell = tr.insertCell(-1);
            var delBtn = document.createElement("button");
            delBtn.innerHTML = "delete";
            delBtn.setAttribute("onclick", `delete_album(${response[i].ID})`);
            tabCell.appendChild(delBtn);
            var tabCell = tr.insertCell(-1);
            var updateBtn = document.createElement("button");
            updateBtn.innerHTML = "update";
            updateBtn.setAttribute("onclick",
             `update_album(${response[i].ID},
                 "${i}1",
                 "${i}2",
                 "${i}3")`);
            tabCell.appendChild(updateBtn);
            var tabCell = tr.insertCell(-1);
            var detailsBtn = document.createElement("button");
            detailsBtn.innerHTML = "Show Details";
            detailsBtn.setAttribute("onclick",
             `show_album(${response[i].ID})`);
            tabCell.appendChild(detailsBtn);

        };

        let container = document.getElementById("show_data");
        container.innerHTML = "";
        container.appendChild(table);
    });
};

create_form.addEventListener("submit", e => {
    e.preventDefault();
    const albumDetails = {
        title: create_title.value,
        artist: create_artist.value,
        year: create_year.value
    };

    fetch("/api/albums", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(albumDetails)
    })
    .then(res => res.json())
    .then(response => {
        if(response.error){
            album_err.innerHTML = response.error;
        } else {
            album_err.innerHTML = "";
        }
        create_table();
    });
});
