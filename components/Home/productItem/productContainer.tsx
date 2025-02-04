import React from "react";
import { ProductInfo } from "./productContainer.styles";
import Image from "next/image";
import { ProductVariant, Slug, Vendor } from "../../../pages/index";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { urlFor, sanityClient } from "../../../lib/sanity";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0/dist/frontend/use-user";
import debounce from "../../../utils/debounce";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Button } from "@mui/material";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useSanityUIDContext } from "../../../context/sanityUserId";

interface ProductProps {
  productProps: {
    defaultProductVariant: ProductVariant;
    slug: Slug;
    title: string;
    vendor: Vendor;
    _id: string;
  };
  userLikedProducts: { _key: string; _ref: string }[] | undefined;
  userSavedProducts: { _key: string; _ref: string }[] | undefined;
}

const ProductContainer = ({
  productProps,
  userLikedProducts,
  userSavedProducts,
}: ProductProps) => {
  const sanityUID = useSanityUIDContext();
  console.log("Hi mom!", sanityUID);
  const router = useRouter();
  const [likes, setLikes] = useState({ likeCount: 5, likeState: false });
  const [postSaveState, setPostSaveState] = useState(false);

  const { user, error } = useUser();
  const handleLikes: (id: string) => void = useCallback(
    debounce((productId: string) => {
      if (!user) {
        router.replace("/api/auth/login");
        return;
      }
      fetch("/api/handleLikes", {
        method: "POST",
        body: JSON.stringify({
          _id: productId,
          likeState: !likes.likeState,
          userId: sanityUID,
          likedProducts: {
            _type: "reference",
            _ref: productProps._id,
          },
          productItemKey: userLikedProducts?.filter(
            (product) => product._ref == productProps._id
          )[0]?._key,
        }),
      });
    }, 2000),
    [sanityUID]
  );

  const handlePostSave: (id: string) => void = useCallback(
    debounce((productId: string) => {
      if (!user) {
        router.replace("/api/auth/login");
        return;
      }
      fetch("/api/handlePostSave", {
        method: "POST",
        body: JSON.stringify({
          productId,
          saveState: !postSaveState,
          sanityUID,
          savedProduct: {
            _type: "reference",
            _ref: productProps._id,
          },
          productItemKey: userSavedProducts?.filter(
            (product) => product._ref == productProps._id
          )[0]?._key,
        }),
      });
    }, 2000),
    [sanityUID]
  );

  useEffect(() => {
    async function handler() {
      let likeCountData = await sanityClient.fetch(
        `*[_type == "product" && _id == $current] {
     likes

    }`,
        { current: productProps._id }
      );
      if (!user || !userLikedProducts) {
        setLikes((prev) => {
          return { ...prev, likeCount: likeCountData[0].likes };
        });

        return;
      } else {
        setLikes({
          likeCount: likeCountData[0].likes,
          likeState: userLikedProducts!
            .map((proudct) => proudct._ref)
            .includes(productProps._id),
        });
      }
    }
    handler();
  }, [user, userLikedProducts]);

  return (
    <ProductInfo key={productProps._id}>
      <div id="vendor-info-container">
        <div id="vendor-info">
          <Image
            placeholder="blur"
            blurDataURL="/placeholder.png"
            className="vendorImage"
            width={50}
            height={50}
            src={urlFor(productProps.vendor.logo).url()}
            alt={productProps.title}
            onClick={() => {
              router.push(`/vendor/${productProps.vendor._id}`);
            }}
          />
          <span style={{ marginLeft: "30px" }}>
            {productProps.vendor.title}
          </span>
        </div>
        <Button style={{ color: "black" }}>
          <MoreHorizIcon fontSize="large" />
        </Button>
      </div>
      <motion.div
        whileTap={{ scale: 0.9 }}
        style={{ width: "100%", height: "20rem", position: "relative" }}
      >
        <Image
          placeholder="blur"
          blurDataURL="/placeholder.png"
          layout="fill"
          objectFit="cover"
          src={urlFor(productProps.defaultProductVariant.images[0]).url()}
          alt="Product Image"
          onClick={() => {
            router.push(`/product/${productProps.slug.current}`);
          }}
        />
      </motion.div>

      <div style={{ paddingLeft: "3vw" }}>
        <div id="action-section">
          <div>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => {
                setLikes((prev) => {
                  if (prev.likeState) {
                    return { likeCount: prev.likeCount - 1, likeState: false };
                  }
                  return { likeCount: prev.likeCount + 1, likeState: true };
                });
                handleLikes(productProps._id);
              }}
            >
              {likes.likeState ? (
                <FavoriteIcon
                  fontSize="large"
                  sx={{ marginRight: "10px" }}
                  color="error"
                />
              ) : (
                <FavoriteBorderIcon
                  fontSize="large"
                  sx={{ marginRight: "10px" }}
                />
              )}
            </motion.button>
            <button>
              <CommentRoundedIcon
                fontSize="large"
                sx={{ marginRight: "10px" }}
              />
            </button>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={async () => {
                try {
                  await navigator.share({
                    title: "Ecommerce",
                    text: "BUY THIS NOW!!!",
                    url: `/product/${productProps.slug.current}`,
                  });
                } catch (err) {
                  alert(err);
                }
              }}
            >
              <SendRoundedIcon fontSize="large" sx={{ marginRight: "10px" }} />
            </motion.button>
          </div>
          <motion.button
            id="save-button"
            whileTap={{ scale: 0.8 }}
            onClick={() => {
              setPostSaveState((prev) => {
                handlePostSave(productProps._id);
                return !prev;
              });
            }}
          >
            {postSaveState ? (
              <BookmarkIcon fontSize="large" sx={{ marginRight: "10px" }} />
            ) : (
              <BookmarkBorderRoundedIcon
                fontSize="large"
                sx={{ marginRight: "10px" }}
              />
            )}
          </motion.button>
        </div>
        <h4 style={{ marginTop: "10px" }}>{`${likes.likeCount} like${
          likes.likeCount > 1 || likes.likeCount == 0 ? "s" : ""
        }`}</h4>
      </div>
    </ProductInfo>
  );
};

export default ProductContainer;
