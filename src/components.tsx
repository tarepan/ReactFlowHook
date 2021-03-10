import React, { FC } from "react";
import { fetchProfile, getNextId, Post, Profile } from "./data";
import { isPromise, Pendable, useFlow } from "./useFlow";

export const App: FC = () => {
  const [state, setFlow] = useFlow<Profile>({
    userId: -1,
    user: { name: "-" },
    posts: [],
  });
  return (
    <>
      <button
        onClick={() => {
          const nextUserId = getNextId(state.userId);
          setFlow(fetchProfile(nextUserId));
        }}
      >
        Load next Profile
      </button>
      <ProfilePage state={state} />
    </>
  );
};

export const ProfilePage: FC<{ state: Pendable<Profile> }> = (prop) => {
  if (isPromise(prop.state.user)) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{prop.state.user.name}</h1>
      <ProfileTimeline posts={prop.state.posts} />
    </>
  );
};

export const ProfileTimeline: FC<{ posts: Post[] | Promise<Post[]> }> = (
  prop
) => {
  if (isPromise(prop.posts)) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {prop.posts.map((post) => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
};
