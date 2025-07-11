function seleccionar() {
  const dropdown = document.getElementById("categorias-dropdown");
  dropdown.classList.toggle("hidden");
}

function cargarCategoria(categoria) {
  const main = document.querySelector("main");
  main.innerHTML = `<h2>${categoria.toUpperCase()}</h2>
    <section class="section-novedades">
      <article class="product">
        <a href="#">
          <img src="https://via.placeholder.com/200" alt="${categoria}">
          <div class="product-info">
            <h2>Producto ${categoria}</h2>
            <p>Descripción de ${categoria}</p>
            <p>$1999</p>
          </div>
        </a>
      </article>
    </section>`;
}
