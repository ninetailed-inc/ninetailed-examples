import { ExperienceConfiguration } from "@ninetailed/experience.js";
import {
  Entry,
  ExperienceMapper,
  isExperienceEntry,
} from "@ninetailed/experience.js-utils-contentful";
import productEntry from "../../fixtures/contentful/product-with-experience.json";

export const transformedExperiences: ExperienceConfiguration[] = (
  productEntry.fields.nt_experiences as Entry[]
)
  .filter(isExperienceEntry)
  .map((experience) =>
    ExperienceMapper.mapExperience(experience, {
      mapVariant: (variant) => ({
        ...variant.fields,
        id: variant.sys.id,
        hidden: false,
      }),
    })
  );
