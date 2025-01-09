import {
  NinetailedAnalyticsPlugin,
  SanitizedElementSeenPayload,
  Template,
  TrackComponentProperties,
} from '@ninetailed/experience.js-plugin-analytics';
import { template } from '@ninetailed/experience.js-shared';

type NinetailedHeapPluginOptions = {
  eventNameTemplate?: string;
  categoryPropertyTemplate?: string;
  componentPropertyTemplate?: string;
  audiencePropertyTemplate?: string;

  template?: Template;
};

const TEMPLATE_OPTIONS = {
  interpolate: /{{([\s\S]+?)}}/g,
};

const isHeapInitialized = () => {
  return (
    typeof window === 'object' &&
    'heap' in window &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    typeof window.heap !== 'undefined'
  );
};

export class NinetailedHeapPlugin extends NinetailedAnalyticsPlugin {
  public name = 'ninetailed:heap';

  constructor(private options: NinetailedHeapPluginOptions = {}) {
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

  protected async onTrackExperience(
    properties: SanitizedElementSeenPayload,
    hasSeenExperienceEventPayload: Record<string, string>
  ): Promise<void> {
    if (!isHeapInitialized()) {
      return;
    }

    const { event, ...trackEventProperties } = hasSeenExperienceEventPayload;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.heap.track(event, trackEventProperties);
  }

  protected async onTrackComponent(
    properties: TrackComponentProperties
  ): Promise<void> {
    if (!isHeapInitialized()) {
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.heap.track(event, {
      category: categoryProperty,
      component: componentProperty,
      audience: audienceProperty,
      isPersonalized,
    });
  }
}
