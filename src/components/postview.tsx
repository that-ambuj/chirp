import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex gap-4 border-b border-neutral-800 p-4">
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
