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

const productsAll = await getAllProducts();

console.log(productsAll);