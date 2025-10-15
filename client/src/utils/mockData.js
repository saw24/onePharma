// src/utils/mockData.js

export const mockPointsOfSale = [
  {
    id: 1,
    name: "Pharmacie Centrale",
    address: "123 Rue de la République, Niamey",
    phone: "+227 20 72 xx xx",
    lat: 13.5117,
    lng: 2.1251,
    stock: [
      { productId: 1, quantity: 50, price: 2500 },
      { productId: 2, quantity: 100, price: 500 },
      { productId: 3, quantity: 30, price: 3000 },
      { productId: 4, quantity: 80, price: 1200 },
    ]
  },
  {
    id: 2,
    name: "Pharmacie du Marché",
    address: "45 Avenue du Commerce, Zinder",
    phone: "+227 20 51 xx xx",
    lat: 13.8048,
    lng: 8.9881,
    stock: [
      { productId: 1, quantity: 25, price: 2600 },
      { productId: 2, quantity: 75, price: 550 },
      { productId: 5, quantity: 40, price: 4500 },
      { productId: 6, quantity: 60, price: 800 },
    ]
  },
  {
    id: 3,
    name: "Pharmacie Modern",
    address: "78 Rue du Sahel, Maradi",
    phone: "+227 20 41 xx xx",
    lat: 13.5,
    lng: 7.1,
    stock: [
      { productId: 3, quantity: 45, price: 3200 },
      { productId: 4, quantity: 90, price: 1300 },
      { productId: 5, quantity: 35, price: 4600 },
      { productId: 6, quantity: 70, price: 850 },
    ]
  }
]

export const mockProducts = [
  { id: 1, name: "Paracetamol" },
  { id: 2, name: "Ibuprofene" },
  { id: 3, name: "Amoxicilline" },
  { id: 4, name: "Omeprazole" },
  { id: 5, name: "Artemether/Lumefantrine" },
  { id: 6, name: "Metronidazole" }
]