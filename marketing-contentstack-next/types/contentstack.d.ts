export interface IFile {
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

export interface ILink {
  title: string;
  href: string;
}

export interface IButton {
  /** Button Link */
  button_link: ILink;
  /** Button Variant */
  button_variant?: 'Primary' | 'Secondary' | 'Tertiary';
}

export interface ISeo {
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
export interface INtExperience {
  /** Name */
  nt_name: string;
  /** Description */
  nt_description?: string;
  /** Type */
  nt_type: 'nt_experiment' | 'nt_personalization';
  /** Config */
  nt_config: any;
  /** Audience */
  nt_audience?: INtAudience[];
  /** Variants */
  nt_variants?: (
    | IPricingTable
    | INavigation
    | IHero
    | IBanner
    | IFeature
    | ICta
  )[];
  /** Title */
  title: string;
}

/** Ninetailed Merge Tag */
export interface INtMergetag {
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
export interface INtAudience {
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

export interface IPricingPlan {
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
  button?: IButton;
  /** Most Popular */
  most_popular?: boolean;
}

export interface IPricingTable {
  /** Title */
  title: string;
  /** Headline */
  headline?: any;
  /** Subline */
  subline?: any;
  /** Pricing Plans */
  pricing_plans?: IPricingPlan[];
  /** Ninetailed */
  nt_experiences?: INtExperience[];
}

export interface IFeature {
  /** Title */
  title: string;
  /** Headline */
  headline?: any;
  /** Subline */
  subline?: any;
  /** Buttons */
  buttons?: IButton[];
  /** Image */
  image?: IFile;
  /** Image Position */
  image_position?: 'left' | 'right';
  /** Ninetailed */
  nt_experiences?: INtExperience[];
}

export interface ICta {
  /** Title */
  title: string;
  /** Headline */
  headline?: any;
  /** Subline */
  subline?: any;
  /** Buttons */
  buttons?: IButton[];
  /** Ninetailed */
  nt_experiences?: INtExperience[];
}

export interface IHero {
  /** Internal Title */
  title: string;
  /** Headline */
  headline?: any;
  /** Subline */
  subline?: any;
  /** Buttons */
  buttons?: IButton;
  /** Image */
  image?: IFile;
  /** Ninetailed */
  nt_experiences?: INtExperience[];
}

export interface INavigation {
  /** Title */
  title: string;
  /** Navigation Items */
  navigation_items?: {
    /** Title */
    title?: string;
    /** Page Reference */
    page_reference: ILandingPage[];
  }[];
  /** Ninetailed */
  nt_experiences?: INtExperience[];
}

export interface IHubspotForm {
  /** Title */
  title: string;
  /** Hubspot Form ID */
  hubspot_form_id?: string;
  /** Hubspot Portal ID */
  hubspot_portal_id?: string;
}

export interface IFooter {
  /** Title */
  title: string;
  /** Footer Links */
  footer_links?: {
    /** Title */
    title: string;
    /** Page Reference */
    page_reference: ILandingPage[];
  }[];
  /** Copyright */
  copyright?: any;
}

export interface ILandingPage {
  /** Title */
  title: string;
  /** SEO */
  seo?: ISeo;
  /** URL */
  url?: string;
  /** Banner */
  banner?: IBanner[];
  /** Navigation */
  navigation?: INavigation[];
  /** Sections */
  sections?: (ICta | IFeature | IHero | IHubspotForm | IPricingTable)[];
  /** Footer */
  footer?: IFooter[];
}

export interface IBanner {
  /** Title */
  title: string;
  /** Text */
  text?: any;
  /** Link */
  link?: ILink;
  /** Ninetailed */
  nt_experiences?: INtExperience[];
}
