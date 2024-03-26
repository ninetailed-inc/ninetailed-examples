import serverContext from 'server-only-context';

export const [getExperiences, setExperiences] = serverContext<Record<
  string,
  number
> | null>(null);
