import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md";
  variant?: "default" | "white";
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  variant = "default",
}) => {
  const isSm = size === "sm";

  return (
    <Link href="/" passHref className="cursor-pointer z-20">
      <div
        className={clsx(
          "flex text-start  items-center ",
          isSm ? "gap-1.5" : "gap-2",
        )}
      >
        <Image
          src="/logo.svg"
          alt="Logo"
          width={isSm ? 20 : 28}
          height={isSm ? 20 : 28}
          className="rounded"
        />
        <div>
          <div
            className={clsx(
              "font-bold tracking-tight",
              variant === "default" ? "text-white" : "text-primary",
              isSm ? "text-sm" : "text-base",
            )}
            style={{
              color: "#0095FF",
            }}
          >
            TABZO
          </div>
          <div className="text-[10px] text-muted-foreground font-medium tracking-tight -mt-2">
            Window & Tab Manager
          </div>
        </div>
      </div>
    </Link>
  );
};
