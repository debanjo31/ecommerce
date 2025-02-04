import { AnimatePresence } from "framer-motion";
import React, { useContext, createContext, ReactNode } from "react";
import { useState } from "react";
import ShoppingCartOverlay from "../components/ShoppingCart/shoppingCartOverlay";
import { ProudctInfo } from "../components/ShoppingCart/shoppingCartOverlay.styles";

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export const useShoppingCart = () => useContext(ShoppingCartContext);

interface ShoppingCartProviderProps {
  children: ReactNode;
}

interface ShoppingCartContext {
  modifyItemQuantity: (
    productInfo: ProductInfo,
    productQuantity: number
  ) => void;
  getItemQuantity: (id: string) => number | undefined;
  getCartQuantity: () => number;
  cartOpen: boolean;
  cartItems: CartItem[];
  removeFromCart: (id: string) => void;
  getTotalCartPrice: () => number;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProductInfo {
  _id: string;
  title: string;
  sku: string;
  defaultProductVariant?: DefaultProdVariant;
  isVariant: boolean;
  price?: number;
  images?: { asset: { _ref: string; _type: string } }[];
}

export interface DefaultProdVariant {
  images: { asset: { _ref: string; _type: string } }[];
  price: number;
  sku: string;
  title: string;
}

interface MoreVendorItem {
  defaultProductVariant: {
    images: [];
    price: number;
    taxable: boolean;
    title: string;
  };
  slug: Slug;
}

interface CartItem {
  _id: string;
  totalPrice: number;
  title: string;
  sku: string;
  isVariant: boolean;
  quantity: number;
  defaultProductVariant?: DefaultProdVariant;
  images?: { asset: { _ref: string; _type: string } }[];
}

interface Slug {
  _type: string;
  current: string;
}

export const ShoppingCartProvider = ({
  children,
}: ShoppingCartProviderProps) => {
  const [cartItems, setCartItems] = useState([] as CartItem[]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  console.log(cartItems, "its all here bro");
  function getItemQuantity(id: string) {
    const data = cartItems.find((item) => {
      return item._id == id;
    })?.quantity;
    return data;
  }

  function getTotalCartPrice() {
    return cartItems.reduce((prev, curr) => {
      return prev + curr.totalPrice;
    }, 0);
  }

  function getCartQuantity() {
    return cartItems.length;
  }

  function removeFromCart(id: string) {
    setCartItems((currentItems) => {
      return currentItems.filter((item) => item._id !== id);
    });
  }

  function modifyItemQuantity(
    productInfo: ProductInfo,
    productQuantity: number
  ) {
    setCartItems((currentItems) => {
      if (
        currentItems?.find(
          (item) => item._id === productInfo._id && item.sku === productInfo.sku
        ) == null
      ) {
        return [
          ...currentItems,
          {
            ...productInfo,
            quantity: productQuantity,
            totalPrice: productInfo.isVariant
              ? productInfo.price! * productQuantity
              : productInfo.defaultProductVariant!.price * productQuantity,
          },
        ];
      } else {
        return currentItems.map((item) => {
          if (item._id == productInfo._id && item.sku === productInfo.sku) {
            return {
              ...item,
              quantity: productQuantity,
              totalPrice: productInfo.isVariant
                ? productInfo.price! * productQuantity
                : productInfo.defaultProductVariant!.price * productQuantity,
            };
          } else {
            return item;
          }
        });
      }
    });
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        modifyItemQuantity,
        getItemQuantity,
        getCartQuantity,
        cartOpen,
        cartItems,
        setCartOpen,
        removeFromCart,
        getTotalCartPrice,
      }}
    >
      <AnimatePresence>{cartOpen && <ShoppingCartOverlay />}</AnimatePresence>
      {children}
    </ShoppingCartContext.Provider>
  );
};
