var socket = io.connect('http://localhost:8080', {'forceNew': true});
var user_id = 0;

socket.on('messages', function(data, selected){
    console.log(data);
    // alert(data);
    if(selected === 'todos'){
        render(data);
    }else{
        renderNotify(data);
    }
});

// socket.on("disconnect", () => {
//     console.log(socket.connected);
// });

socket.on('usuarios', function(usuarios){
    console.log(usuarios)

    //agregar nuevos usuarios
    usuarios.map(function (data, index){

        var busqueda = false;

        var lista = document.getElementById("usuarios");
        for (i = 0; i < lista.options.length; i++) {
            if (lista.options[i].value == data) {
                busqueda = true;
            }
        }

        if(busqueda === false){

            var option = document.createElement('option');
            option.value = data;
            option.text = data;
    
            var usuarios_select = document.getElementById('usuarios');
            usuarios_select.appendChild(option);

        }

    });

    //quitar usuarios que ya no se encuentran en la lista
    var lista = document.getElementById("usuarios");
    for (i = 0; i < lista.options.length; i++) {
        var option = lista.options[i].value;

        if(option != 'todos'){
        const found = usuarios.find(element => element === option);
            if(typeof found === 'undefined'){
                lista.options.remove(i);
            }
        }
    }
});

socket.on('message_private', function(data){
    console.log(data);
    renderTitle(data);

    //actualizar usuario id
    user_id = data[0]['user_id'];
});

function render(data){

    var html = data.map(function (element, index){

        return(`<div>
                <strong>${element.author}</strong>
                <em>${element.text}</em>
        </div>`);

    }).join(" ");


    document.getElementById('messages').innerHTML = html;
}

function renderTitle(data){
    $html = `<h3>${data[0]['text']}: ${data[0]['user_id']}</h3>`;

    var title_welcome = document.getElementById('title-welcome');

    title_welcome.innerHTML = $html;

    title_welcome.style.fontFamily = "helvetica";
    title_welcome.style.textAlign = "center";
    title_welcome.style.backgroundColor = "#222222";
    title_welcome.style.color = "white";
    title_welcome.style.padding = "5px";
    title_welcome.style.marginBottom = "20px";

}

function renderNotify(data){

    var notify = document.getElementById('notify');
    notify.innerHTML = `${data.author}:  ${data.text}`;

}

function addMessages(e){

    var payload = {
        author: document.getElementById('username').value,
        text: document.getElementById('texto').value,
        id: user_id,
    }

    var combo = document.getElementById("usuarios");
    var selected = combo.options[combo.selectedIndex].value;
    
    if(selected === 'todos'){
        socket.emit('new-message', payload, 'todos');
    }else{
        socket.emit('new-message', payload, selected);
    }
    
    return false;
}