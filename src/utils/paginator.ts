export interface PaginatedResult<T> {
  list: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export type PaginateOptions = {
  page: number;
  perPage: number;
};

export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
) => Promise<PaginatedResult<T>>;

export const paginator = (
  defaultOptions: PaginateOptions,
): PaginateFunction => {
  return async (model, args: any = { where: undefined }) => {
    const page = defaultOptions?.page || 1;
    const perPage = defaultOptions?.perPage || 10;

    const skip = page > 0 ? perPage * (page - 1) : 0;
    const [total, list] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: perPage,
        skip,
      }),
    ]);
    const lastPage = Math.ceil(total / perPage);

    return {
      list,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  };
};
