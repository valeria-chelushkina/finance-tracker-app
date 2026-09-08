export type BodyParameters = {
  id: number;
};

export type UpdateBodyParameters<T> = Partial<T> & {
  id: number;
};
