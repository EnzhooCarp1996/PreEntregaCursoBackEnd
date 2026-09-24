async function getAllProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products", {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error(`Error HTTP! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo productos:", error);
  }
}

async function getProductById(id) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error(`Error HTTP! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error obteniendo producto con ID: ${id}`, error);
  }
}

async function createProduct(productData) {
  try {
    const res = await fetch("https://fakestoreapi.com/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      throw new Error(`Error HTTP! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error creando el producto:`, error);
  }
}

async function deleteProduct(id) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Error HTTP! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error eliminando producto con ID: ${id}`, error);
  }
}

const [, , method, endpoint] = process.argv;
const endpointEstandar = endpoint?.replace(/^\/+/, "");

if (
  !(
    endpointEstandar === "products" || endpointEstandar?.startsWith("products/")
  )
) {
  console.log("Endpoint no válido.");
  process.exit(1);
}

switch (method) {
  case "GET":
    if (endpointEstandar?.startsWith("products/")) {
      const id = endpointEstandar.split("/")[1];
      if (!id || isNaN(Number(id))) {
        console.log(
          "Endpoint no válido. Use products/:id para consultar un producto.",
        );
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
    if (endpointEstandar === "products") {
      const products = await createProduct();
      console.log(products);
    } else {
      console.log(
        "Endpoint no válido. Use products para traer todos los productos o products/:id para traer un solo producto.",
      );
    }
    break;
  case "DELETE":
    if (!endpointEstandar.startsWith("products/")) {
      console.log(
        "Endpoint no válido. Use products/:id para eliminar el producto.",
      );
      break;
    }

    const id = endpointEstandar.split("/")[1];
    if (!id || isNaN(Number(id))) {
      console.log(
        "Endpoint no válido. Use products/:id para eliminar el producto.",
      );
      break;
    }
    const product = await deleteProduct(id);
    console.log("Producto Eliminado: ", product);
    break;
}
