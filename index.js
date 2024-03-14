document.addEventListener('DOMContentLoaded', function() {
    const setUrlBtn = document.getElementById('set-url-btn');
    const statusMsg = document.getElementById('status-msg');
    const listCarsBtn = document.getElementById('listCarsBtn');
    const deleteCarForm = document.getElementById('deleteCarForm');
    const addCarForm = document.getElementById('addCarForm'); 
    const events = [
        'getCars',
        'postCar',
        'deleteCar'
    ];

    let apiUrl = ''; // Variable para almacenar la URL del backend

    setUrlBtn.addEventListener('click', function() {
        // En lugar de establecer manualmente la URL, el front-end utilizará la URL del balanceador de carga
        apiUrl = 'http://localhost:4949'; // El balanceador de carga debería estar en la ruta /api
        statusMsg.textContent = 'URL establecida correctamente';
        statusMsg.classList.remove('hidden');
    });

    listCarsBtn.addEventListener('click', async function() {
        try {
            const response = await fetch("http://localhost:4949/listCars");
            if (response.ok) {
                const dataCars = await response.json(); // Convertir la respuesta a JSON
                console.log(dataCars); // Imprimir la respuesta por consola
            } else {
                console.error("Error al listar carros:", response.status);
            }
    
            statusMsg.textContent = 'Vehículos listados correctamente (ver consola)';
            statusMsg.classList.remove('hidden');
        } catch (error) {
            console.error('Error al listar vehículos:', error);
            statusMsg.textContent = 'Error al listar vehículos';
            statusMsg.classList.remove('hidden');
        }
    }); 

    addCarForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    
        try {
            const placa = document.getElementById('placa').value;
            const color = document.getElementById('color').value;
            const image = document.getElementById('imagen').files[0]; // Tomar solo la primera imagen seleccionada
            const fecha_entrafa = new Date().toISOString(); // Obtener la fecha y hora actual en el formato esperado
    
            const formData = new FormData();
            formData.append('placa', placa);
            formData.append('color', color);
            formData.append('image', image);
            formData.append('fecha_entrafa', fecha_entrafa);

            const responseIp = await fetch("http://localhost:4949/addCar");
            const data = await responseIp.json();
            console.log(formData.get('fecha_entrafa'));
            const response = await fetch(`${data.nextBackend}/cars`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    placa: placa,
                    color: color,
                    image: image,
                    fecha_entrafa: fecha_entrafa
                })
            });
            const responseData = {
                placa: placa,
                color: color,
                image: image,
                fecha_entrafa: fecha_entrafa
            };
            
            console.log(responseData);
    
            if (response.ok) {
                statusMsg.textContent = 'Carro agregado correctamente';
            } else {
                throw new Error('Error al agregar carro');
            }
        } catch (error) {
            console.error('Error al agregar carro:', error);
            statusMsg.textContent = 'Error al agregar carro';
        }
    });
    
    deleteCarForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        try {
            const placa = document.getElementById('placaToDelete').value;
            const responseDeleteCar = await fetch(`http://localhost:4949/deleteCar/${placa}`, { method: 'DELETE' });
            if (responseDeleteCar.ok) {
                const data = await responseDeleteCar.json();
                const responseConfirm = await fetch(`${data.nextBackend}/cars/${data.placa}`, { method: 'DELETE' });
                console.log(`${responseConfirm}`);
                document.getElementById('delete-car-msg').textContent = 'Carrito borrado correctamente';
            } else {
                document.getElementById('delete-car-msg').textContent = 'Error al borrar carrito';
            }
            document.getElementById('delete-car-msg').classList.remove('hidden');
        } catch (error) {
            console.error('Error al borrar carrito:', error);
            statusMsg.textContent = 'Error al borrar carrito';
            statusMsg.classList.remove('hidden');
        }
    });
    
    
    
});


