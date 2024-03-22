import {
  Baseline,
  ExperienceConfiguration,
  Reference,
} from '@ninetailed/experience.js-shared';

export type ExperienceComponent<P> = React.ComponentType<
  Omit<P, 'id'> & {
    ninetailed?: {
      isPersonalized: boolean;
      audience: { id: string };
    };
  }
>;

export type ExperienceBaseProps<
  P,
  PassThroughProps extends Partial<P>,
  Variant extends Pick<P, Exclude<keyof P, keyof PassThroughProps>> & Reference
> = Baseline<Pick<P, Exclude<keyof P, keyof PassThroughProps>>> & {
  experiences: ExperienceConfiguration<Variant>[];
  component: React.ComponentType<P>;
  passthroughProps?: PassThroughProps;
};

export type ExperienceLoadingComponent<
  P,
  PassThroughProps extends Partial<P>,
  Variant extends Pick<P, Exclude<keyof P, keyof PassThroughProps>> & Reference
> = React.ComponentType<ExperienceBaseProps<P, PassThroughProps, Variant>>;

export type ExperienceProps<
  P,
  PassThroughProps extends Partial<P> = Partial<P>,
  Variant extends Pick<P, Exclude<keyof P, keyof PassThroughProps>> &
    Reference = Pick<P, Exclude<keyof P, keyof PassThroughProps>> & Reference
> = ExperienceBaseProps<P, PassThroughProps, Variant> & {
  experiences: ExperienceConfiguration<Variant>[];
  component: React.ComponentType<P>;
  loadingComponent?: ExperienceLoadingComponent<P, PassThroughProps, Variant>;
};

type DefaultExperienceLoadingComponentProps = ExperienceBaseProps<
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown> & Reference
> & {
  unhideAfterMs?: number;
};
