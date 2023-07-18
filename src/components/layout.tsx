import { type PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren<{}>) => {
  return (
    <div className="flex h-screen justify-center">
      <div className="h-full w-full overflow-y-scroll border-x border-neutral-800 md:max-w-3xl">
        {props.children}
      </div>
    </div>
  );
};
