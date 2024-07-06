import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";

const Home = () => {
  const dispatch = useDispatch();
  // console.log(useLatestProductsQuery, "home7");

  const { data, isLoading, isError } = useLatestProductsQuery("");
  // console.log(data, isLoading, isError, 'home12');

  const handleAddToCart = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) toast.error("Can't fetch the Products");

  return (
    <div className="home">
      <section></section>
      <h1 className="text-2xl">
        Latest Products
        <Link
          to="/search"
          className="findmore text-sm underline underline-offset-4"
        >
          More
        </Link>
      </h1>

      <main>
        {/* <ProductCard
          productId="123"
          name="Macbook"
          price={12000}
          stock={10}
          handler={handleAddToCart}
          photo="https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg"
        /> */}
        {isLoading ? (
          <Skeleton width="80vw" />
        ) : (
          data?.products.map((item) => (
            <ProductCard
              key={item._id}
              productId={item._id}
              name={item.name}
              price={item.price}
              stock={item.stock}
              handler={handleAddToCart}
              photo={item.photo}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
