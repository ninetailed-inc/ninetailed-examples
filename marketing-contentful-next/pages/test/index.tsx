import { getStaticHero } from '@/lib/api';
import { parseExperiences } from '@/lib/experiences';
import { IHero, IHeroFields } from '@/types/contentful';
import { Experience } from '@ninetailed/experience.js-next';
import { GetStaticProps } from 'next';
import { forwardRef, useEffect, useState } from 'react';

const ConditionalComponentForwardRef = forwardRef(function ConditionalComponent(
  { fields }: { fields: IHeroFields },
  ref
) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });

  return loading ? (
    <div ref={ref}>I am still loading...</div>
  ) : (
    <pre ref={ref}>{JSON.stringify(fields.internalName, null, 2)}</pre>
  );
});

const Test = ({ hero }: { hero: IHero }) => {
  const mappedExperiences = parseExperiences(hero);
  return (
    <>
      <div
        style={{
          minHeight: '150vh',
          textAlign: 'center',
          alignContent: 'center',
          backgroundColor: 'papayawhip',
        }}
      >
        Lol I take up space
      </div>
      <Experience
        id={hero.sys.id}
        component={ConditionalComponentForwardRef}
        experiences={mappedExperiences}
        {...hero}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const hero = await getStaticHero();

  return {
    props: {
      hero,
    },
    revalidate: 5,
  };
};

export default Test;
