import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { api } from "~/utils/api";

import { Inter } from "next/font/google";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

const interFont = Inter({
  subsets: ["latin"],
});

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessages = e.data?.zodError?.fieldErrors.content;

      toast.error(
        errorMessages?.at(0) ?? "Failed to post! Please try again later."
      );
    },
  });

  if (!user) return null;

  return (
    <div className="flex w-full gap-4">
      <Image
        src={user.profileImageUrl}
        alt="Profile Photo"
        width={200}
        height={200}
        className="h-14 w-14 rounded-full"
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate({ content: input });
        }}
        className="flex w-full"
      >
        <input
          placeholder="Type some emojies!"
          className="grow bg-transparent outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPosting}
        />
        {input !== "" && !isPosting && <button>Post</button>}

        {isPosting && (
          <div className="flex items-center justify-center">
            <LoadingSpinner size={24} />
          </div>
        )}
      </form>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map((postData) => (
        <PostView {...postData} key={postData.post.id} />
      ))}
    </div>
  );
};

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <LoadingPage />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {isSignedIn && <CreatePostWizard />}
      </div>

      <Feed />
    </PageLayout>
  );
}
