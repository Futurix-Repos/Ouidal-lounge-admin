// Global declaration of the type of the application
// ----------------------------------------------------------------------

declare type Product = {
  id: string
  name: string
  buyingPrice: number
  sellingPrice: number
  cookingPlace: string
  margin: number
  stock: number
  sellingPerUnit: {
    isTrue: boolean
    price: number
    qty: number
    unit: string
  }
}
