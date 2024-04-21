import { twMerge } from "tailwind-merge";

function Card(props: {
  variant?: string;
  className?: string;
  children?: JSX.Element | any[];
  [x: string]: any;
}) {
  const { variant, className, children, ...rest } = props;
  return (
    <div
      className={twMerge(className, "card bg-base-100 shadow-xl")}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
