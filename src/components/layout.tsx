import { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren<{}>) => {
  return (
    <div className="flex h-screen justify-center">
      <div className="h-full w-full overflow-y-auto border-x border-slate-400 md:max-w-2xl">
        {props.children}
      </div>
    </div>
  );
};
