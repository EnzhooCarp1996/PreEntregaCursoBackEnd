async function getAllProducts() {
    try {
        const res = await fetch('https://fakestoreapi.com/products', {method: "GET"});
        if (!res.ok) {
            throw new Error(`Error HTTP! status: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error obteniendo productos:', error);
    }
}

async function getProductById(id) {
    try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`, {method: "GET"});
        if (!res.ok) {
            throw new Error(`Error HTTP! status: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Error obteniendo producto con ID: ${id}`, error);
    }
}

const [, , method, endpoint] = process.argv;
const normalizedEndpoint = endpoint?.replace(/^\/+/, '');

if (method === 'GET' && normalizedEndpoint === 'products') {
    const products = await getAllProducts();
    console.log(products);
} else if (method === "GET" && normalizedEndpoint?.startsWith('products/')) {
    const id = normalizedEndpoint.split('/')[1];
    const product = await getProductById(id);
    console.log(product);
} else {
    console.log('Endpoint no válido. Use /products para obtener todos los productos o /products/:id para obtener un producto específico.');
}
