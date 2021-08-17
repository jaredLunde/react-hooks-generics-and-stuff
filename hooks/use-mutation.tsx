export function useOtherMutation<Method extends keyof Mutation>(
  method: Method,
  data: Mutation[Method]
): MutationResults[Method] {
  // @ts-expect-error
  return {};
}

type Mutation = {
  post: Post;
  put: Put;
  delete: Delete;
};

type MutationResults = {
  post: Post;
  put: Put;
  delete: Delete;
};

const Component = () => {
  useOtherMutation("post", { data: { name: "woweofwe" } });
  useOtherMutation("put", { data: { id: 5, name: "woweofwe" } });
  const result = useOtherMutation("delete", { data: { id: 5 } });
  result.data.id;
};

type Post = {
  data: {
    name: string;
  };
};

type Put = {
  data: {
    id: number;
    name: string;
  };
};

type Delete = {
  data: {
    id: number;
  };
};
