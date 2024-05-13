import { IConfig, IPage } from '@/types/contentful';
import { ExperienceConfiguration } from '@ninetailed/experience.js-next';

// FIXME: Re-export this type from utils-contentful?
export type Audience = {
  name: string;
  description?: string | undefined;
  id: string;
};

export type CustomPageProps = {
  page: IPage;
  config: IConfig;
  ninetailed?: {
    preview?: {
      allExperiences: ExperienceConfiguration[];
      allAudiences: Audience[];
    };
  };
};
