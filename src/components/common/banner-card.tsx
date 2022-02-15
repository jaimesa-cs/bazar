import type { FC } from "react";
import Image from "next/image";
import Link from "@components/ui/link";
import { LinkProps } from "next/link";
import cn from "classnames";
import { useWindowSize } from "@utils/use-window-size";

interface BannerProps {
  banner: any;
  variant?: "rounded" | "default";
  effectActive?: boolean;
  className?: string;
  classNameInner?: string;
  href: LinkProps["href"];
}

function getImage(deviceWidth: number, imgObj: any) {
  return deviceWidth < 480 ? imgObj.mobile : imgObj.desktop;
}

const BannerCard: FC<BannerProps> = ({
  banner,
  className,
  variant = "rounded",
  effectActive = false,
  classNameInner,
  href,
}) => {
  const { width } = useWindowSize();
  const { title, image } = banner;
  const selectedImage = getImage(width, image);
  return (
    <div className={cn("mx-auto", className)}>
      <Link href={href} className={cn("h-full group flex justify-center relative overflow-hidden", classNameInner)}>
        <Image
          src={selectedImage.url}
          width={selectedImage.width}
          height={selectedImage.height}
          alt={title}
          quality={100}
          className={cn("bg-gray-300 object-cover w-full", {
            "rounded-md": variant === "rounded",
          })}
        />
        {/* <img src={selectedImage.url} alt={title} className="bg-gray-300 object-cover w-full" /> */}
        {effectActive && (
          <div className="absolute top-0 -start-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
        )}
      </Link>
    </div>
  );
};

export default BannerCard;
