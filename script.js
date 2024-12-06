// Obtener referencia al lienzo
const canvas = document.getElementById('viewer');
const context = canvas.getContext('2d');

// Configuración inicial
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let images = []; // Para almacenar las imágenes
let hotspots = []; // Para almacenar los hotspots
let currentIndex = 0;

// Leer el archivo XML y cargar configuración
console.log('Cargando XML...');
async function loadConfig() {
    try{
        const response = await fetch('config/PUERTA%20PET.xml'); // Asegúrate de colocar el XML aquí
    //const response = await fetch('file:///D:/360Viewer/config/PUERTA%20PET.xml');
    
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const xmlText = await response.text();
    console.log('XML cargado correctamente:', xmlText);
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Leer rutas de las imágenes
    const imageNodes = xmlDoc.getElementsByTagName('image');
    images = Array.from(imageNodes).map(node => node.getAttribute('src'));

     // Verifica si las imágenes se cargan correctamente
     if (images.length > 0) {
        drawImage(0); // Llama a la función para dibujar la primera imagen
    } else {
        console.error('No se encontraron imágenes en el XML.');
    }

    // Leer configuración de hotspots
    const hotspotNodes = xmlDoc.getElementsByTagName('hotspot');
    hotspots = Array.from(hotspotNodes).map(node => ({
        x: parseFloat(node.getAttribute('offsetX')),
        y: parseFloat(node.getAttribute('offsetY')),
        text: node.getAttribute('source')
    }));
    } catch(error){
        console.error('Error al cargar el XML:', error);
    }
}

// Dibujar la imagen actual
function drawImage(index) {
    const img = new Image();
    img.src = images[index];
    img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const aspectRatio = img.width / img.height;
        const newWidth = canvas.width;
        const newHeight = canvas.width / aspectRatio;
        context.drawImage(img, 0, (canvas.height - newHeight) / 2, newWidth, newHeight);

        // Dibujar hotspots
        drawHotspots();
    };
}

// Dibujar los hotspots
function drawHotspots() {
    hotspots.forEach(hotspot => {
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(hotspot.x, hotspot.y, 10, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    });
}

// Manejar interacción del usuario
let startX = 0;
let isDragging = false;

canvas.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - startX;
        if (Math.abs(deltaX) > 10) { // Cambiar al siguiente fotograma
            startX = e.clientX;
            currentIndex = (currentIndex + (deltaX > 0 ? 1 : -1) + images.length) % images.length;
            drawImage(currentIndex);
        }
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Ajustar tamaño del lienzo al cambiar la ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawImage(currentIndex);
});

// Iniciar visor
loadConfig().then(() => {
    drawImage(currentIndex);
});
