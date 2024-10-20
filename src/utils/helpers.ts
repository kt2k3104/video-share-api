import { PaginationRes } from '../common/types/response';

export const paginateResponse = (
  data: any[],
  total: number,
  page: number,
  limit: number,
): PaginationRes => {
  return {
    data,
    metadata: {
      page,
      total,
      limit,
    },
  };
};
