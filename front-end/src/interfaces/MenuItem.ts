interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string
}

interface CartItem extends MenuItem {
  quantity: number;
}

export { MenuItem, CartItem }