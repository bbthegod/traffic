/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * ImageGallery
 *
 */
"use client";
import { useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { files } from "@/utils/common";
import Image from "next/image";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export const ImageGallery = ({ open, setOpen }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState(0);
  const onClick = (e: any) => {
    if (ref.current) {
      if (!ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
  };

  const prev = () => {
    setImage(Math.max(0, image - 1));
  };
  const next = () => {
    setImage(Math.min(4, image + 1));
  };

  //====================================== Render ======================================
  return open ? (
    <div className="bg-[#11182740] fixed top-0 right-0 left-0 bottom-0 z-[998] flex justify-center items-center" onClick={onClick}>
      <div ref={ref} className="bg-base-100 shadow-md p-6 z-[999] h-[90%] overflow-y-auto">
        <TransformWrapper>
          {({ zoomIn, zoomOut, resetTransform }: any) => (
            <>
              <div className="flex gap-2 mb-2">
                <button className="btn btn-primary btn-sm" onClick={() => zoomIn()}>
                  Zoom In
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => zoomOut()}>
                  Zoom Out
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => resetTransform()}>
                  Reset
                </button>
                <div className="flex-1" />
                <button className="btn btn-primary btn-sm" onClick={prev}>
                  Trước
                </button>
                <button className="btn btn-primary btn-sm" onClick={next}>
                  Sau
                </button>
              </div>
              <TransformComponent>
                <Image src={`/${files[image]}.jpg`} width={500} height={500} alt={""} />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  ) : null;
};
