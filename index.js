async function requestApi(url, options = {}) {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`Error HTTP! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error en la petición:", error);
  }
}

async function getAllProducts() {
  return await requestApi("https://fakestoreapi.com/products", {
    method: "GET",
  });
}

async function getProductById(id) {
  return await requestApi(`https://fakestoreapi.com/products/${id}`, {
    method: "GET",
  });
}

async function createProduct(product) {
  return await requestApi("https://fakestoreapi.com/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

async function deleteProduct(id) {
  return await requestApi(`https://fakestoreapi.com/products/${id}`, {
    method: "DELETE",
  });
}

const [, , method, endpoint, title, price, category] = process.argv;
const endpointEstandar = endpoint?.replace(/^\/+/, "");

if (!validarEndpoint(endpointEstandar)) {
  process.exit(1);
}

switch (method) {
  case "GET":
    if (endpointEstandar?.startsWith("products/")) {
      const id = obtenerIdProducto(endpointEstandar);

      if (!id) {
        console.log("Endpoint no válido. Utilice products/:id.");
        break;
      }

      const product = await getProductById(id);
      console.log(product);
      break;
    }
    const products = await getAllProducts();
    console.log(products);
    break;
  case "POST":
    if (endpointEstandar !== "products") {
      console.log(
        "Endpoint no válido. Para crear un producto utilice: products",
      );
      break;
    }
    if (!title || !price || !category) {
      console.log(
        "Faltan datos. Utilice: POST products <title> <price> <category>",
      );
      break;
    }
    const productNew = {
      title,
      price: Number(price),
      category,
    };
    const createdProduct = await createProduct(productNew);

    console.log(
      `Producto "${productNew.title}" creado exitosamente con ID: ${createdProduct.id}`,
    );
    break;

  case "DELETE":
    const id = obtenerIdProducto(endpointEstandar);

    if (!id) {
      console.log("Endpoint no válido. Utilice products/:id.");
      break;
    }
    const product = await deleteProduct(id);
    console.log(
      `Producto ${product.title} con ID: ${id} eliminado exitosamente.`,
    );
    break;
}

function validarEndpoint(endpoint) {
  if (endpoint !== "products" && !endpoint?.startsWith("products/")) {
    console.log("Endpoint no válido.");
    return false;
  }

  return true;
}

function obtenerIdProducto(endpoint) {
  const partes = endpoint.split("/");

  if (
    partes.length !== 2 ||
    partes[0] !== "products" ||
    !partes[1] ||
    isNaN(Number(partes[1]))
  ) {
    return null;
  }

  return partes[1];
}
subir la refactorizacion