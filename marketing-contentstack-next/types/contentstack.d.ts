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
  publish_details: {
    environment: string;
    locale: string;
    time: string;
    user: string;
  };
}

export interface Link {
  title: string;
  href: string;
}

export interface Button {
  /** Button Link */
  button_link: Link;
  /** Button Variant */
  button_variant?: 'Primary' | 'Secondary' | 'Tertiary';
}

export interface Seo {
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
  /** Name */
  nt_name: string;
  /** Description */
  nt_description?: string;
  /** Type */
  nt_type: 'nt_experiment' | 'nt_personalization';
  /** Audience */
  nt_audience?: NtAudience[];
  /** Config */
  nt_config: any;
  /** Variants */
  nt_variants?: (PricingTable | Navigation | Hero | Feature | Cta | Banner)[];
  /** Title */
  title: string;
}

/** Ninetailed Merge Tag */
export interface NtMergetag {
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
  /** Title */
  title?: string;
  /** Name */
  nt_name: string;
  /** Description */
  nt_description?: string;
  /** Rules */
  nt_rules: any;
  /** Audience Id */
  nt_audience_id: string;
}

export interface PricingPlan {
  /** Internal Title */
  title: string;
  /** Title */
  display_title?: any;
  /** Price */
  price?: any;
  /** Frequency */
  frequency?: '/month' | '/week' | '/day';
  /** Discounted Price */
  discounted_price?: any;
  /** Description */
  description?: any;
  /** Button */
  button?: Button;
  /** Most Popular */
  most_popular?: boolean;
}

export interface PricingTable {
  /** Title */
  title: string;
  /** Headline */
  headline?: any;
  /** Subline */
  subline?: any;
  /** Pricing Plans */
  pricing_plans?: PricingPlan[];
  /** Ninetailed */
  nt_experiences?: NtExperience[];
}

export interface Feature {
  /** Title */
  title: string;
  /** Headline */
  headline?: any;
  /** Subline */
  subline?: any;
  /** Buttons */
  buttons?: Button[];
  /** Image */
  image?: File;
  /** Image Position */
  image_position?: 'left' | 'right';
  /** Ninetailed */
  nt_experiences?: NtExperience[];
}

export interface Cta {
  /** Title */
  title: string;
  /** Headline */
  headline?: any;
  /** Subline */
  subline?: any;
  /** Buttons */
  buttons?: Button[];
  /** Ninetailed */
  nt_experiences?: NtExperience[];
}

export interface Hero {
  /** Internal Title */
  title: string;
  /** Headline */
  headline?: any;
  /** Subline */
  subline?: any;
  /** Buttons */
  buttons?: Button[];
  /** Image */
  image?: File;
  /** Ninetailed */
  nt_experiences?: NtExperience[];
}

export interface Navigation {
  /** Title */
  title: string;
  /** Navigation Items */
  navigation_items?: {
    /** Title */
    title?: string;
    /** Page Reference */
    page_reference: LandingPage[];
  }[];
  /** Ninetailed */
  nt_experiences?: NtExperience[];
}

export interface HubspotForm {
  /** Title */
  title: string;
  /** Hubspot Form ID */
  hubspot_form_id?: string;
  /** Hubspot Portal ID */
  hubspot_portal_id?: string;
}

export interface Footer {
  /** Title */
  title: string;
  /** Footer Links */
  footer_links?: {
    /** Title */
    title?: string;
    /** Page Reference */
    page_reference?: LandingPage[];
  }[];
  /** Copyright */
  copyright?: any;
}

export interface LandingPage {
  /** Title */
  title: string;
  /** SEO */
  seo?: Seo;
  /** URL */
  url?: string;
  /** Banner */
  banner?: Banner[];
  /** Navigation */
  navigation?: Navigation[];
  /** Sections */
  sections?: (Cta | Feature | Hero | HubspotForm | PricingTable)[];
  /** Footer */
  footer?: Footer[];
}

export interface Banner {
  /** Title */
  title: string;
  /** Text */
  text?: any;
  /** Link */
  link?: Link;
  /** Ninetailed */
  nt_experiences?: NtExperience[];
}
