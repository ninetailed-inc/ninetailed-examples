import { Combobox, Style } from '@makeswift/runtime/controls';
import { ReactRuntime } from '@makeswift/runtime/react';
import { getBaselineHeroes } from '../api';
import { IHero } from '@/types/contentful';
import { parseExperiences } from '../experiences';
import { Experience } from '@ninetailed/experience.js-next';
import { Hero } from '@/components/Hero';

function ContentfulHero({
  className,
  hero,
}: {
  className?: string;
  hero?: IHero;
}) {
  if (!hero) return <h1 className="justify-center">Select A Hero</h1>;
  return (
    <div
      data-makeswift-wrapper
      className={`${className || ''} makeswiftWrapper`}
    >
      {hero && (
        <Experience
          {...hero}
          id={hero.sys.id}
          experiences={parseExperiences(hero)}
          component={Hero}
        />
      )}
    </div>
  );
}

// eslint-disable-next-line
// @ts-ignore
ReactRuntime.registerComponent(ContentfulHero, {
  type: 'contentful-hero',
  label: 'Contentful Hero',
  props: {
    className: Style({ properties: Style.All }),
    hero: Combobox({
      label: 'Contentful Hero',
      // eslint-disable-next-line
      // @ts-ignore
      async getOptions(query) {
        const heroes = await getBaselineHeroes({ preview: true });

        return heroes
          .map((hero) => ({
            id: hero.sys.id,
            label: hero.fields.internalName,
            value: hero,
          }))
          .filter((option) =>
            option.label.toLowerCase().includes(query.toLowerCase())
          );
      },
    }),
  },
});
