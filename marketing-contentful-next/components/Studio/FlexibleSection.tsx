import React from 'react';
import {
  createExperience,
  ExperienceRoot,
  detachExperienceStyles,
} from '@contentful/experiences-sdk-react';

import './registeredComponents.ts';
import './registeredTokens.ts';

export function FlexibleSection(props: { fields: { studio: string } }) {
  const experience = createExperience(props.fields.studio);
  const experienceStyles = detachExperienceStyles(experience) ?? '';

  return (
    <>
      <style>{experienceStyles}</style>
      <main style={{ width: '100%' }}>
        <ExperienceRoot experience={experience} locale={'en-US'} />
      </main>
    </>
  );
}
