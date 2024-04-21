import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export const ZoomableImg = ({ src }: any) => (
  <Zoom>
    <img
      alt="Image"
      src={src || "/assets/images/user-default.svg"}
      className="w-20 h-20 object-cover"
    />
  </Zoom>
);
