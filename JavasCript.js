import namesContries from './json/names.json' assert {type: 'json'}
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js'
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyBT1OPi9YDAdRjTBbYGu1TQF1qN2l1Kdik",
    authDomain: "serfinanzadb.firebaseapp.com",
    projectId: "serfinanzadb",
    storageBucket: "serfinanzadb.appspot.com",
    messagingSenderId: "1039617068810",
    appId: "1:1039617068810:web:c4ae6e72cfba51abb4f4f3",
    measurementId: "G-7068D710E2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Seleccion Id de etiquetas
const d = document

const $btnHiden = d.getElementById('btn-hidden')
const $title = d.getElementsByClassName('title')

const $form = d.getElementById('form')
const $inputs=d.querySelectorAll('#form input')
const $select = d.getElementById('country')

const $sectionUser= d.getElementById('section-users')
const $table = d.getElementById('table')


//Convertí el objeto en un unico array con la informacion dentro
const arrays = [Object.entries(namesContries)]
const country = arrays[0]

//luego iteré entre ellos y convertí todo en una cadena de texto separada por comas
// la cual guardé en la variable "cadenaStrings"
let cadenaStrings = ''

for (const index in country) {
    cadenaStrings += `${country[index][1]},`
}

// convertí cada pais en un array tomando como referencia las comas agregadas
let arrayPaises = cadenaStrings.split(",")
let indice = arrayPaises.length - 1

// en este paso borré un array en blanco
let deleteSpacing = arrayPaises.splice(indice, 1)

// En este paso nuevamente creé una cadena de texto ya que habia un pais el cual tenia espacios
// a los lados, por lo cual al ordenar los paises alfaveticamnete me salia de primero, lo que no deberia.
// no lo hice desde el primer for ya que los paises aun no estaban convertidos en arrays individuales
let cadenaStrings2 = []
for (const index in arrayPaises) {
    cadenaStrings2 += `${arrayPaises[index].trim()},`
}


// aqui nuevamente los convierto en arrays individuales
let correcion = cadenaStrings2.split(",")
//ordeno exitosamente el array
const paises = correcion.sort()
//elimino el primer array con datos en blanco
let deleteSpacing2 = correcion.splice(0, 1)

//aqui procedo a insertar cada pais en el select
for (const index in paises) {
    $select.innerHTML += `<option value="${paises[index]}">${paises[index]}</option>`
}



// funcion para mostrar y ocultar el formulario y cambiar palabras
function hidden() {
    if ($form.classList.value === 'form') {
        $form.classList.add('active')
        $sectionUser.classList.add('active')
        $title[0].innerText = 'Crear Usuario'
        $btnHiden.innerText = 'Ocultar'
    } else {
        $form.classList.remove('active')
        $sectionUser.classList.remove('active')
        $title[0].innerText = 'Bienvenido!'
        $btnHiden.innerText = 'Mostrar Formulario'
    }
}


// agregando evento al formulario
$btnHiden.addEventListener('click', hidden)


// aqui inplementamos la funcion la cual nos ayudara a ver los usuarios agregados



async function getData() {
    let datos = []
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        datos.push(doc.data());
    });
    localStorage.setItem("user", JSON.stringify(datos))
}
getData()

const usuarios = JSON.parse(localStorage.getItem("user"))

console.log(usuarios.sort())

let table = ''


for (const index in usuarios) {
    table += `<tr class='filas'><td>${usuarios[index].name}</td>
    <td>${usuarios[index].lastName}</td>
    <td>${usuarios[index].email}</td>
    <td>${usuarios[index].phone}</td>
    <td>${usuarios[index].country}</td></tr>`
}


$table.innerHTML+=table





// funcion submit la cual es necesaria para que el formulario envie los datos al backend

//validacion con expreciones
const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,35}$/, // Letras y espacios, pueden llevar acentos.
    apellido: /^[a-zA-ZÀ-ÿ\s]{1,35}$/,
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	telefono: /^\d{10,10}$/ // 7 a 14 numeros.
}

// ----------------------------------------

function validacionDeFormulario(e){
    switch(e.target.name){    
		case "name":
            validarCampo(expresiones.nombre,e.target,'name')
		break;
		case "lastName":
			validarCampo(expresiones.apellido, e.target, 'lastName');
		break;
		case "email":
			validarCampo(expresiones.correo, e.target, 'email');
		break;
		case "phone":
			validarCampo(expresiones.telefono, e.target, 'phone');
		break;
    }
}

const campos = {
    name: false,
	lastName: false,
	email: false,
	phone: false
}

function validarCampo(expresion,input,campo){
    if (expresion.test(input.value)) {
        d.getElementById(`data_${campo}`).classList.add('correcto')
        d.getElementById(`data_${campo}`).classList.remove('incorrecto')
        d.querySelector(`#data_${campo} .data-input i` ).classList.add('bxs-check-circle')
        d.querySelector(`#data_${campo} .data-input i` ).classList.remove('bxs-x-circle')
        d.querySelector(`#data_${campo} .data-input span` ).classList.remove('invalid')
        campos[campo]=true;
    }else{
        d.getElementById(`data_${campo}`).classList.remove('correcto')
        d.getElementById(`data_${campo}`).classList.add('incorrecto')
        d.querySelector(`#data_${campo} .data-input i` ).classList.remove('bxs-check-circle')
        d.querySelector(`#data_${campo} .data-input i` ).classList.add('bxs-x-circle')
        d.querySelector(`#data_${campo} .data-input span` ).classList.add('invalid')
        campos[campo]=false;
    }
    
}



$inputs.forEach((input)=>{
    input.addEventListener('keyup',validacionDeFormulario)
    input.addEventListener('blur',validacionDeFormulario)
})

$form.addEventListener('submit', async (e) => {
    e.preventDefault()

    let element = e.currentTarget.elements

    let country ={country: element.country.value}

    if (campos.name && campos.lastName && campos.email && campos.phone && country.country !== 'Seleccionar Pais') {
       
    const users = {
        name: element.name.value,
        lastName: element.lastName.value,
        email: element.email.value,
        phone: element.phone.value,
        country: element.country.value
    }    
        try {
            const docRef = await addDoc(collection(db, "users"), users)
            $form.reset()
            alert('Usuario creado correctamente')
            setTimeout(() => {
                location.reload()
            }, 2000);
            
        } catch (error) {
            console.log(error)
        }
    } else {
        alert('Por favor seleccionar Pais')
    }

})




