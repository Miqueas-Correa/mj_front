// Funcion para el carrusel
function scrollCarrusel(direction) {
    const carrusel = document.getElementById('carrusel');
    const scrollAmount = 260; // igual o mayor que el ancho de un producto
    carrusel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}