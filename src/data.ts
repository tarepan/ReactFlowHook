import { isPromise } from "./useFlow";

export type Profile = {
  userId: number;
  user: User;
  posts: Post[];
};
export type UserId = number;
export type User = { name: string };
export type Post = { id: number; text: string };

export function getNextId(id: UserId | Promise<UserId>): UserId {
  return isPromise(id) ? 0 : id === 3 ? 0 : id + 1;
}

export const fetchProfile = (userId: UserId) => ({
  userId: Promise.resolve(userId),
  user: fetchUser(userId),
  posts: fetchPosts(userId),
});

export function fetchUser(userId: UserId): Promise<User> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(userName(userId)), 2000 * Math.random())
  );
}

export function fetchPosts(userId: number): Promise<Post[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(userPost(userId)), 2000 * Math.random())
  );
}

export function userName(userId: number): User {
  switch (userId) {
    case 0:
      return { name: "Ringo Starr" };
    case 1:
      return { name: "George Harrison" };
    case 2:
      return { name: "John Lennon" };
    case 3:
      return { name: "Paul McCartney" };
    default:
      throw Error("Unknown user.");
  }
}

export function userPost(userId: number): Post[] {
  switch (userId) {
    case 0:
      return [
        {
          id: 0,
          text: "I get by with a little help from my friends",
        },
        {
          id: 1,
          text: "I'd like to be under the sea in an octupus's garden",
        },
        {
          id: 2,
          text: "You got that sand all over your feet",
        },
      ];
    case 1:
      return [
        {
          id: 0,
          text: "Turn off your mind, relax, and float downstream",
        },
        {
          id: 1,
          text: "All things must pass",
        },
        {
          id: 2,
          text: "I look at the world and I notice it's turning",
        },
      ];
    case 2:
      return [
        {
          id: 0,
          text: "Living is easy with eyes closed",
        },
        {
          id: 1,
          text: "Nothing's gonna change my world",
        },
        {
          id: 2,
          text: "I am the walrus",
        },
      ];
    case 3:
      return [
        {
          id: 0,
          text: "Woke up, fell out of bed",
        },
        {
          id: 1,
          text: "Here, there, and everywhere",
        },
        {
          id: 2,
          text: "Two of us sending postcards, writing letters",
        },
      ];
    default:
      throw Error("Unknown user.");
  }
}
