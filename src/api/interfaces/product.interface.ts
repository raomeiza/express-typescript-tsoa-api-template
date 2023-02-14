interface IProduct {
  title?: string;
  in_stock?: boolean;
  quantity?: number;
  price: number;
  discount?: number;
  tags?: string[];
  type?: 'product' | 'service';
  category?: string;
  description?: string;
  short_description?: string;
  images?: string[];
  quantity_sold?: number;
  quantity_viewed?: number;
  quantity_in_cart?: number;
  quantity_in_wishlist?: number;
  quantity_in_compare?: number;
  brand?: string;
  rating?: number;
  uploaded_by?: string;
}

export default IProduct;