// Guardamos el JSON en una constante

const URL = 'https://6542bfaf01b5e279de1f84e6.mockapi.io/users'

// Función que devuelve todos los usuarios del JSON

async function getData(url){
    try {

        let response = await fetch(url);
        let responseContents = await response.json();
        return responseContents;

    } catch (error) {
        console.log(error.message);
    }
}

// Función que devuelve el usuario que tiene el ID especificado

async function getDataByID(url, number){
    try {

        url += `/${number}`;
        let response = await fetch(url);
        let responseContents = await response.json();
        return responseContents;

    } catch (error) {
        console.log(error.message);
    }
}

// Función que permite agregar un nuevo usuario al final del JSON

async function postData(url, nombre, apellido){
    try {

        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ name: nombre, lastname: apellido }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        let responseContents = await response.json();
        return responseContents;

    } catch (error) {
        console.log(error.message);
    }
}

// Función que realiza un fetch para modificar un usuario especificado por su ID del JSON

async function putDataByID(url, number, nombre, apellido){
    try {
        
        url += `/${number}`;
        let response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify({name: nombre, lastname: apellido}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        let responseContents = await response.json();
        return responseContents;

    } catch (error) {
        console.log(error.message);
    }
}

// Función que permite eliminar un usuario especificado por su ID del JSON

async function deleteDataByID(url, number){
    try {
        
        url += `/${number}`;
        let response = await fetch(url, {
            method: "DELETE"
        });
        let responseContents = await response.json();
        return responseContents;

    } catch (error) {
        console.log(error.message);
    }
}


// Guardamos los inputs en variables

const inputGET = document.querySelector("#inputGet1Id");
const buttonGET = document.querySelector("#btnGet1");

const inputName = document.querySelector("#inputPostNombre");
const inputLastName = document.querySelector("#inputPostApellido");
const buttonPOST = document.querySelector("#btnPost");

const inputPUTId = document.querySelector("#inputPutId");
const buttonPUT = document.querySelector("#btnPut");
const inputPUTName = document.querySelector("#inputPutNombre");
const inputPUTLastName = document.querySelector("#inputPutApellido");
const buttonSendPUT = document.querySelector("#btnSendChanges");

const inputDELETE = document.querySelector("#inputDelete");
const buttonDELETE = document.querySelector("#btnDelete");

// Variable en la que guardamos los resultados

const results = document.querySelector("#results");

/*
Funciones que chequean que los campos relacionados con los botones no estén vacios, y en
caso de que lo estén, deshabilita dichos botones (habilitandolos en caso contrario).
*/

function checkPOST(){
    if (!inputName.value || !inputLastName.value){
        buttonPOST.disabled = true;
    } else {
        buttonPOST.disabled = false;
    }
}

function checkPUT(){
    if (!inputPUTId.value){
        buttonPUT.disabled = true;
    } else {
        buttonPUT.disabled = false;
    }
}

/*
Booleano que permite que el boton sea deshabilitado si el usuario
que se quiere modificar no existe
*/

let validUser = true;

function checkSendPUT(){
    console.log(validUser);
    if (!inputPUTName.value || !inputPUTLastName.value || !validUser){
        buttonSendPUT.disabled = true;
    } else {
        buttonSendPUT.disabled = false;
    }
}

function checkDELETE(){
    if (!inputDELETE.value){
        buttonDELETE.disabled = true;
    } else {
        buttonDELETE.disabled = false;
    }
}

// Ejecutamos las funciones una primera vez

checkPOST();
checkPUT();
checkSendPUT();
checkDELETE();

// Funcion que agrega los usuarios al HTML (para mostrarlos)

function showData(array){
    if (array.length != undefined){
        if (array[0].id == undefined){
            const message = document.getElementById("alert-error");
            message.classList.add("show");
            setTimeout(() => {
                message.classList.remove("show");
            }, "3000");
            return;
        }
        for (i = 0; i < array.length; i++) {
            results.innerHTML +=
            `<li>
            <h3 class="text-center">USUARIO ${i+1}</h3>
            <p>ID: ${array[i].id}</p>
            <p>NAME: ${array[i].name}</p>
            <p>LASTNAME: ${array[i].lastname}</p>
            </li>
            <br>`
        }
    } else {
        results.innerHTML +=
        `<li>
            <p>ID: ${array.id}</p>
            <p>NAME: ${array.name}</p>
            <p>LASTNAME: ${array.lastname}</p>
        </li>
        <br>`
    }
}


/*
Agregamos un addEventListener al boton GET, el cual cita todos los elementos del JSON
si el campo de GET esta vacio, o cita el elemento correspondiente al ID ingresado
*/


buttonGET.addEventListener("click", async function(){
    
    results.innerHTML = "";
    let users = [];
    if (!inputGET.value){
        users = await getData(URL);
    } else {
        users = await getDataByID(URL, inputGET.value);
    }
    showData(users);

});

/*
addEventListeners que se activan al modificar los valores que contienen los inputs, y que
habilitan o deshabilitan los botones relacionados según si sus inputs tienen contenido o no
*/

inputName.addEventListener("input", () => checkPOST());

inputLastName.addEventListener("input", () => checkPOST());

inputPUTId.addEventListener("input", () => checkPUT());

inputPUTName.addEventListener("input", () => checkSendPUT());

inputPUTLastName.addEventListener("input", () => checkSendPUT());

inputDELETE.addEventListener("input", () => checkDELETE());

/*
Agregamos un addEventListener al boton DELETE, que elimina el usuario de ID especificado, además
de mostrar al mismo, y al resto de usuarios aún no eliminados
*/

buttonDELETE.addEventListener("click", async function(){
    
    results.innerHTML = "";
    const deleted = await deleteDataByID(URL, inputDELETE.value);
    if (deleted.id == undefined){
        const message = document.getElementById("alert-error");
        message.classList.add("show");
        setTimeout(() => {
            message.classList.remove("show");
        }, "3000");
        return;
    }
    const users = await getData(URL);
    results.innerHTML +=
    `<li>
    <h3 class="text-center">USUARIO ELIMINADO</h3>
    <p>ID: ${deleted.id}</p>
    <p>NAME: ${deleted.name}</p>
    <p>LASTNAME: ${deleted.lastname}</p>
    </li>
    <br>`
    showData(users);

});

/*
Agregamos un addEventListener que permite agregar un nuevo usuario con el nombre y apellido que
el cliente ingresa en los inputs correspondientes (no pueden estar vacíos).
*/

buttonPOST.addEventListener("click", async function(){

    results.innerHTML = "";
    await postData(URL, inputName.value, inputLastName.value);
    const users = await getData(URL);
    showData(users);

});

/*
Agregamos un addEventListener al botonPUT que busca el usuario con el ID que el usuario pretende modificar, y una vez lo
encuentra, guarda su nombre y apellido en los inputs de nombre y apellido (del modal).
*/

buttonPUT.addEventListener("click", async function(){

    const user = await getDataByID(URL, inputPUTId.value);
    if (user.id != undefined){
        validUser = true;
        inputPUTName.value = user.name;
        inputPUTLastName.value = user.lastname;
    } else {
        validUser = false;
        checkSendPUT();
        const message = document.getElementById("alert-error");
        message.classList.add("show");
        setTimeout(() => {
            message.classList.remove("show");
        }, "3000");
        checkSendPUT();
        return;
    }
    checkSendPUT();

});
/*
Agregamos un addEventListener al boton de guardar (del modal) que toma los datos que el usuario ingreso en los
inputs de nombre y apellido (del modal) y actualiza el usuario seleccionado con dichos inputs
*/
buttonSendPUT.addEventListener("click", async function(){

    results.innerHTML = "";
    await putDataByID(URL, inputPUTId.value, inputPUTName.value, inputPUTLastName.value);
    const users = await getData(URL);
    showData(users);

});