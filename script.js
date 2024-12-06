// Obtener el canvas y su contexto
const canvas = document.getElementById('viewer');
const context = canvas.getContext('2d');

// Configuración inicial del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Lista de imágenes para mostrar en el visor 360°
const imagePaths = [
    'images/0001.jpg', 'images/0002.jpg', 'images/0003.jpg', 'images/0004.jpg',
    'images/0005.jpg', 'images/0006.jpg', 'images/0007.jpg', 'images/0008.jpg',
    'images/0009.jpg', 'images/0010.jpg', 'images/0011.jpg', 'images/0012.jpg',
    'images/0013.jpg', 'images/0014.jpg', 'images/0015.jpg', 'images/0016.jpg',
    'images/0017.jpg', 'images/0018.jpg', 'images/0019.jpg', 'images/0020.jpg',
    'images/0021.jpg', 'images/0022.jpg', 'images/0023.jpg', 'images/0024.jpg',
    'images/0025.jpg', 'images/0026.jpg', 'images/0027.jpg', 'images/0028.jpg',
    'images/0029.jpg', 'images/0030.jpg', 'images/0031.jpg', 'images/0032.jpg',
    'images/0033.jpg', 'images/0034.jpg', 'images/0035.jpg', 'images/0036.jpg',
    'images/0037.jpg', 'images/0038.jpg', 'images/0039.jpg', 'images/0040.jpg',
    'images/0041.jpg', 'images/0042.jpg', 'images/0043.jpg', 'images/0044.jpg',
    'images/0045.jpg', 'images/0046.jpg', 'images/0047.jpg', 'images/0048.jpg'
];
let images = [];
let currentIndex = 0;

// Cargar imágenes
function preloadImages(paths) {
    let loaded = 0;
    return new Promise((resolve) => {
        paths.forEach((path, index) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                images[index] = img;
                loaded++;
                if (loaded === paths.length) {
                    resolve();
                }
            };
        });
    });
}

// Dibujar la imagen actual en el canvas
/*function drawImage(index) {
    const img = images[index];
    if (img) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const aspectRatio = img.width / img.height;
        const newWidth = canvas.width;
        const newHeight = canvas.width / aspectRatio;
        context.drawImage(img, 0, (canvas.height - newHeight) / 2, newWidth, newHeight);
    }
}*/
function drawImage(index) {
    const img = images[index];
    if (img) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Calcular el factor de escala para ajustar la imagen al tamaño del canvas
        const scaleWidth = canvas.width / img.width;
        const scaleHeight = canvas.height / img.height;
        const scale = Math.min(scaleWidth, scaleHeight);

        const newWidth = img.width * scale;
        const newHeight = img.height * scale;

        // Calcular la posición para centrar la imagen
        const x = (canvas.width - newWidth) / 2;
        const y = (canvas.height - newHeight) / 2;

        context.drawImage(img, x, y, newWidth, newHeight);
    }
}


// Manejar la navegación de imágenes (arrastrar para cambiar)
let startX = 0;
let isDragging = false;

canvas.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - startX;
        if (Math.abs(deltaX) > 10) { // Cambiar al siguiente fotograma si el desplazamiento es significativo
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

// Ajustar tamaño del canvas al cambiar la ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawImage(currentIndex);
});

// Iniciar el visor
preloadImages(imagePaths).then(() => {
    drawImage(currentIndex);
});
