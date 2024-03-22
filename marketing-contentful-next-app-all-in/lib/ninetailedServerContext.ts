import { Profile, SelectedVariantInfo } from '@ninetailed/experience.js-shared';
import serverContext from 'server-only-context';

export const [getProfile, setProfile] = serverContext<Profile | null>(null);
export const [getExperiences, setExperiences] = serverContext<
  SelectedVariantInfo[] | null
>(null);
