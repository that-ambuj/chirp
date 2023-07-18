import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { Inter } from "next/font/google";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import PageLoader from "next/dist/client/page-loader";
import { PageLayout } from "~/components/layout";

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

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex gap-4 border-b border-slate-400 p-4">
      <div>
        <Image
          src={author.profileImageUrl}
          alt={`@{author.username}'s Profile Picture`}
          width={200}
          height={200}
          className="h-14 w-14 rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-400">
          <Link href={`/@${author.username}`}>
            <span className="font-semibold text-slate-200">
              @{author.username}
            </span>
          </Link>
          <Link href={`/posts/${post.id}`}>
            <span>·</span>
            <span>{dayjs(post.createdAt).fromNow().toString()}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
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
