export interface Filters {
  query: string;
  project: string;
  status: string;
  priority: string;
  assignee: string;
  due: string;
  sort: string;
}
export const defaultFilters: Filters = {
  query: '',
  project: 'all',
  status: 'all',
  priority: 'all',
  assignee: 'all',
  due: 'all',
  sort: 'newest',
};
