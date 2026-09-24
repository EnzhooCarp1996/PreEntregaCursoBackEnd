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

async function createProduct(product) {
  try {
    const res = await fetch("https://fakestoreapi.com/products", {
      method: "POST",
      body: JSON.stringify(product),
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
    console.log(`Producto con ID: ${id} eliminado exitosamente.`);
    return data;
  } catch (error) {
    console.error(`Error eliminando producto con ID: ${id}`, error);
  }
}

const [, , method, endpoint, title, price, category] = process.argv;
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
      if (!validarIdProducto(id, "consultar")) {
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
    const id = endpointEstandar.split("/")[1];
    if (!validarIdProducto(id, "eliminar")) {
      break;
    }
    const product = await deleteProduct(id);
    console.log(
      `Producto ${product.title} con ID: ${id} eliminado exitosamente.`,
    );
    break;
}

function validarIdProducto(id, mensaje) {
  if (!id || isNaN(Number(id))) {
    console.log(
      `Endpoint no válido. Utilice products/:id para ${mensaje} el producto.`,
    );
    return false;
  }
  return true;
}
