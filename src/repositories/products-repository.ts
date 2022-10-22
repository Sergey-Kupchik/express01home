import {newId} from "../routes/videos-router";

const products: ProductType[] = [
    {id: 1, title: "GMO"},
    {id: 2, title: "Melon"},
    {id: 3, title: "Pumpkin"},
    {id: 4, title: "apple"},
    {id: 5, title: "tomato"}
];

type ProductType = {
    id: number
    title: string
};

const productsRepository = {
    findProductByLetterInTitle(title: string | undefined | null) {
        if (title) {
            const foundProduct = products.find(p => p.title.indexOf(title) > -1)
            return (foundProduct)
        } else {
            return (products)
        }
    },
    createProduct(title: string) {
        const newProduct: ProductType = {
            id: newId(),
            title: title
        }
        products.push(newProduct);
        return newProduct
    },
    updateProduct(id: string, title: string) {
        const product = products.find(p => p.id === +id)
        if (product) {
            product.title = title
            return true
        } else {
            return false
        }
    },
    findProductById(id: string,){
        const product = products.find(p => p.id === +id)
        return product
    },
    deleteProductById(id: string,){
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === +id) {
                products.splice(i, 1)
                return true
            }
        }
        return false

    }
}

export {productsRepository, ProductType};