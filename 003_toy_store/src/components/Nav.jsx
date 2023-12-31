import { createPortal } from "react-dom";
import { useContext, useRef } from "react";

import CartModal from "./CartModal.jsx";
import { CartContext } from "./shopping_cart_context";

const buttonClasses = "md:mx-12 sm:mx-6 text-zinc-600 hover:text-zinc-950";

export default function Nav() {
  // Context handling the cart contents
  const { items } = useContext(CartContext);
  const modalRef = useRef();

  const totalItems = Object.values(items).reduce(
    (sum, item) => (sum += item),
    0,
  );

  // open modal when clicking the "cart" button
  function handleCartClick() {
    modalRef.current.open();
  }

  return (
    <>
      <CartModal ref={modalRef} />
      {createPortal(
        <nav className="relative w-full bg-white h-10 z-20">
          <div className="flex justify-between h-full max-w-1280 md:px-44 sm:px-20 mx-auto">
            <h3 className="text-[1.3rem] font-bold tracking-tight my-auto">
              Tanoshii Toys
            </h3>
            <div className="text-base font-semibold text-zinc-950 my-auto">
              <button className={buttonClasses}>Blog</button>
              <button className={buttonClasses}>Shop</button>
              <button className={buttonClasses}>About</button>
            </div>
            <div className="my-auto">
              <button onClick={handleCartClick}>Cart({totalItems})</button>
            </div>
          </div>
        </nav>,
        document.getElementById("nav"),
      )}
    </>
  );
}
