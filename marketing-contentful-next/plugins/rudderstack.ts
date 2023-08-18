import {
  NinetailedAnalyticsPlugin,
  Template,
} from '@ninetailed/experience.js-plugin-analytics';
import {
  TrackComponentProperties,
  TrackExperienceProperties,
} from '@ninetailed/experience.js';
import { template } from '@ninetailed/experience.js-shared';

type NinetailedRudderstackPluginOptions = {
  eventNameTemplate?: string;
  categoryPropertyTemplate?: string;
  componentPropertyTemplate?: string;
  audiencePropertyTemplate?: string;

  template?: Template;
};

const TEMPLATE_OPTIONS = {
  interpolate: /{{([\s\S]+?)}}/g,
};

const isRudderstackInitialized = () => {
  return (
    typeof window === 'object' &&
    'rudderanalytics' in window &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    typeof window.rudderanalytics !== 'undefined'
  );
};

export class NinetailedRudderstackPlugin extends NinetailedAnalyticsPlugin {
  public name = 'ninetailed:rudderstack';

  constructor(private options: NinetailedRudderstackPluginOptions = {}) {
    super({
      ...options.template,
      event: 'nt_experience',
      ninetailed_variant: '{{selectedVariantSelector}}',
      ninetailed_experience: '{{experience.id}}',
      ninetailed_experience_name: '{{experience.name}}',
      ninetailed_audience: '{{audience.id}}',
      ninetailed_component: '{{selectedVariant.id}}',
    });
  }

  // eslint-disable-next-line
  protected async onTrackExperience(
    properties: TrackExperienceProperties,
    hasSeenExperienceEventPayload: Record<string, string>
  ): Promise<void> {
    if (!isRudderstackInitialized()) {
      console.log('ding');
      return;
    }

    const { event, ...trackEventProperties } = hasSeenExperienceEventPayload;

    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    window.rudderanalytics.track(event, trackEventProperties);
  }

  // eslint-disable-next-line
  protected async onTrackComponent(
    properties: TrackComponentProperties
  ): Promise<void> {
    if (!isRudderstackInitialized()) {
      return;
    }

    const { variant, audience, isPersonalized } = properties;
    const event = template(
      this.options.eventNameTemplate ||
        'Has Seen Component - Audience:{{ audience.id }}',
      { variant, audience, isPersonalized },
      TEMPLATE_OPTIONS.interpolate
    );
    const categoryProperty = template(
      this.options.categoryPropertyTemplate || 'Ninetailed',
      {
        variant,
        component: variant,
        audience,
        isPersonalized,
      },
      TEMPLATE_OPTIONS.interpolate
    );
    const componentProperty = template(
      this.options.componentPropertyTemplate || '{{ component.id }}',
      {
        variant,
        component: variant,
        audience,
        isPersonalized,
      },
      TEMPLATE_OPTIONS.interpolate
    );
    const audienceProperty = template(
      this.options.audiencePropertyTemplate || '{{ audience.id }}',
      {
        variant,
        component: variant,
        audience,
        isPersonalized,
      },
      TEMPLATE_OPTIONS.interpolate
    );

    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    window.rudderanalytics.track(event, {
      category: categoryProperty,
      component: componentProperty,
      audience: audienceProperty,
      isPersonalized,
    });
  }
}
