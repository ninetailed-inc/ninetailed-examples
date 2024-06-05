export interface PublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}

export interface File {
  uid: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  content_type: string;
  file_size: string;
  tags: string[];
  filename: string;
  url: string;
  ACL: any[];
  is_dir: boolean;
  parent_uid: string;
  _version: number;
  title: string;
  publish_details: PublishDetails;
}

export interface Link {
  title: string;
  href: string;
}

export interface Taxonomy {
  taxonomy_uid: string;
  max_terms?: number;
  mandatory: boolean;
  non_localizable: boolean;
}

/** A field group for specifying SEO data on an associated page entry. */
export interface Seo {
  /** Version */
  version: 3;
  /** Meta Title */
  meta_title?: string;
  /** Meta Description */
  meta_description?: string;
  /** Enable Search Indexing */
  enable_search_indexing?: boolean;
  /** Enable Link Following */
  enable_link_following?: boolean;
}

/** Ninetailed Experience */
export interface NtExperience {
  /** Version */
  version: 6;
  /** Name */
  nt_name: string;
  /** Description */
  nt_description?: string;
  /** Type */
  nt_type: 'nt_experiment' | 'nt_personalization';
  /** Audience */
  nt_audience?: NtAudience[];
  /** Ninetailed */
  nt_config: any;
  /** Title */
  title: string;
  /** Variants */
  nt_variants?: (Banner | Navigation | LandingPage)[];
}

/** Ninetailed Merge Tag */
export interface NtMergetag {
  /** Version */
  version: 4;
  /** Name */
  nt_name: string;
  /** Fallback */
  nt_fallback?: string;
  /** Merge Tag Id */
  nt_mergetag_id: string;
  /** Title */
  title: string;
}

/** Ninetailed Audience */
export interface NtAudience {
  /** Version */
  version: 4;
  /** Name */
  nt_name: string;
  /** Description */
  nt_description?: string;
  /** Rules */
  nt_rules: any;
  /** Audience Id */
  nt_audience_id: string;
  /** Title */
  title: string;
}

export interface PricingPlan {
  /** Version */
  version: 5;
  /** Internal Title */
  title: string;
  /** Title */
  display_title?: any;
  /** Price */
  price?: any;
  /** Frequency */
  frequency?: ('/month' | '/week') | null;
  /** Discounted Price */
  discounted_price?: any;
  /** Description */
  description?: any;
  /** Button */
  button?: {
    /** Button Link */
    button_link: Link;
    /** Button Variant */
    button_variant?: ('Primary' | 'Secondary' | 'Loud') | null;
  }[];
  /** Most Popular */
  most_popular?: boolean;
}

export interface Config {
  /** Version */
  version: 2;
  /** Internal Title */
  title: string;
  /** Banner */
  banner?: Banner[];
  /** Navigation */
  navigation?: Navigation[];
  /** Footer */
  footer?: Footer[];
}

export interface LandingPage {
  /** Version */
  version: 24;
  /** Title */
  title: string;
  /** SEO */
  seo?: Seo;
  /** URL */
  url?: string;
  /** Ninetailed */
  nt_experiences?: NtExperience[];
  /** Sections */
  sections?: (
    | {
        hero: {
          /** Internal Title */ title?: string;
          /** Headline */
          headline: any;
          /** Subline */
          subline?: string;
          /** Buttons */
          buttons?: [
            {
              /** Button Link */
              button_link: Link;
              /** Button Variant */
              button_variant?: ('Primary' | 'Secondary' | 'Loud') | null;
            },
            {
              /** Button Link */
              button_link: Link;
              /** Button Variant */
              button_variant?: ('Primary' | 'Secondary' | 'Loud') | null;
            }
          ];
          /** Image */
          image?: File | null;
          /** Ninetailed Experiences */
          nt_experiences?: NtExperience[];
        };
        cta: undefined;
        feature: undefined;
        pricing_table: undefined;
        hubspot_form: undefined;
      }
    | {
        cta: {
          /** Internal Title */ title?: string;
          /** Headline */
          headline?: any;
          /** Subline */
          subline?: string;
          /** Buttons */
          buttons?: [
            {
              /** Button Link */
              button_link: Link;
              /** Button Variant */
              button_variant?: ('Primary' | 'Secondary' | 'Loud') | null;
            },
            {
              /** Button Link */
              button_link: Link;
              /** Button Variant */
              button_variant?: ('Primary' | 'Secondary' | 'Loud') | null;
            }
          ];
          /** Ninetailed Experiences */
          nt_experiences?: NtExperience[];
        };
        hero: undefined;
        feature: undefined;
        pricing_table: undefined;
        hubspot_form: undefined;
      }
    | {
        feature: {
          /** Internal Title */ title?: string;
          /** Headline */
          headline?: any;
          /** Subline */
          subline?: string;
          /** Buttons */
          buttons?: {
            /** Button Link */
            button_link: Link;
            /** Button Variant */
            button_variant?: ('Primary' | 'Secondary' | 'Loud') | null;
          }[];
          /** Image */
          image?: File | null;
          /** Image Position */
          image_position?: ('left' | 'right') | null;
          /** Ninetailed Experiences */
          nt_experiences?: NtExperience[];
        };
        hero: undefined;
        cta: undefined;
        pricing_table: undefined;
        hubspot_form: undefined;
      }
    | {
        pricing_table: {
          /** Internal Title */ title?: string;
          /** Headline */
          headline?: any;
          /** Subline */
          subline?: string;
          /** Pricing Plans */
          pricing_plans?: PricingPlan[];
          /** Ninetailed Experiences */
          nt_experiences?: NtExperience[];
        };
        hero: undefined;
        cta: undefined;
        feature: undefined;
        hubspot_form: undefined;
      }
    | {
        hubspot_form: {
          /** Internal Title */ title?: string;
          /** Hubspot Form ID */
          hubspot_form_id?: string;
          /** Hubspot Portal ID */
          hubspot_portal_id?: string;
          /** Ninetailed Experiences */
          nt_experiences?: NtExperience[];
        };
        hero: undefined;
        cta: undefined;
        feature: undefined;
        pricing_table: undefined;
      }
  )[];
  /** Ninetailed Experiences */
  nt_modular_blocks_experiences?: {
    nt_experience_block: {
      /** Title */ nt_title?: string;
      /** Experience */
      nt_experience: NtExperience[];
      /** Baseline */
      nt_baseline: any;
      /** Variants */
      nt_variants?: (
        | {
            hero: {
              /** Internal Title */ title?: string;
              /** Headline */
              headline: any;
              /** Subline */
              subline?: string;
              /** Buttons */
              buttons?: [
                {
                  /** Button Link */
                  button_link: Link;
                  /** Button Variant */
                  button_variant?: ('Primary' | 'Secondary' | 'Loud') | null;
                },
                {
                  /** Button Link */
                  button_link: Link;
                  /** Button Variant */
                  button_variant?: ('Primary' | 'Secondary' | 'Loud') | null;
                }
              ];
              /** Image */
              image?: File | null;
            };
            cta: undefined;
            feature: undefined;
            pricing_table: undefined;
            hubspot_form: undefined;
          }
        | {
            cta: {
              /** Internal Title */ title?: string;
              /** Headline */
              headline?: any;
              /** Subline */
              subline?: string;
              /** Buttons */
              buttons?: [
                {
                  /** Button Link */
                  button_link: Link;
                  /** Button Variant */
                  button_variant?: ('Primary' | 'Secondary' | 'Loud') | null;
                },
                {
                  /** Button Link */
                  button_link: Link;
                  /** Button Variant */
                  button_variant?: ('Primary' | 'Secondary' | 'Loud') | null;
                }
              ];
            };
            hero: undefined;
            feature: undefined;
            pricing_table: undefined;
            hubspot_form: undefined;
          }
        | {
            feature: {
              /** Internal Title */ title?: string;
              /** Headline */
              headline?: any;
              /** Subline */
              subline?: string;
              /** Buttons */
              buttons?: {
                /** Button Link */
                button_link: Link;
                /** Button Variant */
                button_variant?: ('Primary' | 'Secondary' | 'Loud') | null;
              }[];
              /** Image */
              image?: File | null;
              /** Image Position */
              image_position?: ('left' | 'right') | null;
            };
            hero: undefined;
            cta: undefined;
            pricing_table: undefined;
            hubspot_form: undefined;
          }
        | {
            pricing_table: {
              /** Internal Title */ title?: string;
              /** Headline */
              headline?: any;
              /** Subline */
              subline?: string;
              /** Pricing Plans */
              pricing_plans?: PricingPlan[];
            };
            hero: undefined;
            cta: undefined;
            feature: undefined;
            hubspot_form: undefined;
          }
        | {
            hubspot_form: {
              /** Internal Title */ title?: string;
              /** Hubspot Form ID */
              hubspot_form_id?: string;
              /** Hubspot Portal ID */
              hubspot_portal_id?: string;
            };
            hero: undefined;
            cta: undefined;
            feature: undefined;
            pricing_table: undefined;
          }
      )[];
    };
  }[];
}

export interface Footer {
  /** Version */
  version: 3;
  /** Title */
  title: string;
  /** Footer Links */
  footer_links?: {
    /** Title */
    title: string;
    /** Page Reference */
    page_reference?: LandingPage[];
  }[];
  /** Copyright */
  copyright?: any;
}

export interface Navigation {
  /** Version */
  version: 8;
  /** Title */
  title: string;
  /** Navigation Items */
  navigation_items?: {
    /** Title */
    title: string;
    /** Page Reference */
    page_reference: LandingPage[];
  }[];
  /** Ninetailed */
  nt_experiences?: NtExperience[];
}

/** A dismissible call-to-cation displayed at the top of the viewport. */
export interface Banner {
  /** Version */
  version: 8;
  /** Title */
  title: string;
  /** Text */
  text?: any;
  /** Link */
  link?: Link;
  /** Variant */
  variant?: ('primary' | 'loud') | null;
  /** Ninetailed */
  nt_experiences?: NtExperience[];
}
