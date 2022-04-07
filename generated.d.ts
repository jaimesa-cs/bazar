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

export interface Links {
  /** List Title */
  list_title?: string;
  /** Links */
  links?: {
    /** Link */
    link?: Link;
    /** Icon */
    icon?: "Facebook" | "Twitter" | "Instagram" | "Youtube";
    /** Image */
    image?: File;
    /** Category */
    category?: Category[];
  }[];
}

export interface PaymentMethods {
  /** List Title */
  list_title?: string;
  /** Links */
  links?: {
    /** Link */
    link?: Link;
    /** Icon */
    icon?: "Facebook" | "Twitter" | "Instagram" | "Youtube";
    /** Image */
    image?: File;
    /** Category */
    category?: Category[];
  }[];
}

export interface Banner {
  /** Image */
  image?: File;
  /** Link */
  link?: Link;
}

export interface LocaleField {
  /** Select locale */
  select_locale?: (
    | "en-us"
    | "fr"
    | "de"
    | "ja"
    | "ko"
    | "ru"
    | "sk"
    | "es-es"
    | "sv"
    | "tr"
    | "pl"
    | "no"
    | "is"
    | "zh"
    | "cs"
    | "hr"
    | "bs"
    | "hi"
    | "id"
    | "pt"
    | "ro"
    | "sr"
    | "uk"
    | "ur"
    | "fi"
    | "nl"
    | "et"
    | "ka"
    | "sl"
    | "cy"
    | "vi"
    | "th"
    | "ta"
    | "kk"
    | "hy"
    | "hu"
    | "af"
    | "sq"
    | "am"
    | "ar"
    | "az"
    | "bn"
    | "ca"
    | "zh-TW"
    | "fa-AF"
    | "fa"
    | "tl"
    | "fr-CA"
    | "si"
    | "ps"
    | "ml"
    | "ms"
    | "mk"
    | "so"
    | "es-MX"
    | "he"
  )[];
}

export interface System {
  /** Unpublish At */
  unpublish_at?: string;
}

export interface RectangularBlocks {
  /** Image */
  image?: File;
  /** Link */
  link?: Link;
}

export interface SquareBlocks {
  /** Image */
  image?: File;
  /** Link */
  link?: Link;
}

export interface Banners {
  /** Image */
  image?: File;
  /** Link */
  link?: Link;
}

/** Error Pages */
export interface ErrorPages {
  /** Title */
  title: string;
  /** URL */
  url?: string;
  /** Error Number */
  error_number?: number;
  /** Error Message */
  error_message?: string;
}

/** Footer */
export interface Footer {
  /** Title */
  title: string;
  /** URL */
  url?: string;
  /** Copyright */
  copyright?: string;
  /** Links */
  links?: Links[];
  /** Payment Methods */
  payment_methods?: PaymentMethods;
}

/** Email Subscription */
export interface EmailSubscription {
  /** Title */
  title: string;
  /** Subtitle */
  subtitle?: string;
  /** Input Placeholder */
  input_placeholder?: string;
  /** Button Label */
  button_label?: string;
}

export interface HeaderBanner {
  /** Title */
  title: string;
  /** banner */
  banner?: Banner;
}

/** Grouping of Entries for several purpose, pages, apps, etc... */
export interface StaticComposition {
  /** Title */
  title: string;
  /** URL */
  url?: string;
  /** Type */
  type?: "Static";
  /** Header */
  header?: {
    /** Title */
    title?: string;
    /** Subtitle */
    subtitle?: string;
    /** Banner */
    banner?: HeaderBanner[];
  };
  /** Currency */
  currency?: number;
  /** Dynamic Blocks */
  dynamic_blocks?: (
    | {
        mail_list_subscription: {
          /** Email Subscription */ email_subscription?: EmailSubscription[];
        };
        faq: undefined;
        paragraphs_with_links: undefined;
      }
    | {
        faq: {
          /** Questions */
          questions?: {
            /** Question */
            question?: string;
            /** Answers */
            answers?: string[];
          }[];
        };
        mail_list_subscription: undefined;
        paragraphs_with_links: undefined;
      }
    | {
        paragraphs_with_links: {
          /** Paragraphs */
          paragraphs?: {
            /** Title */
            title?: string;
            /** Paragraph */
            paragraph?: any;
          }[];
        };
        mail_list_subscription: undefined;
        faq: undefined;
      }
  )[];
  /** Translation Field */
  locale_field?: LocaleField;
  /** System */
  system?: System;
}

/** Category */
export interface Category {
  /** Title */
  title: string;
  /** URL */
  url?: string;
  /** Link */
  link?: Link;
  /** Categories */
  categories?: Category[];
}

export interface Navigation {
  /** Title */
  title: string;
  /** URL */
  url: string;
  /** Top Level Links */
  links?: {
    /** Link */
    link?: Link;
    /** Category */
    category?: Category[];
    /** Nested Links */
    nested_links?: {
      /** Link */
      link?: Link;
      /** Nested Links */
      nested_links?: {
        /** Link */
        link?: Link;
      }[];
    }[];
  }[];
}

export interface ValidationTest {
  /** Title */
  title: string;
  /** Custom Validation */
  custom_validation: string;
  /** Single Line Textbox */
  single_line: string;
  /** RTE Content */
  rte_content?: any;
  /** Html 5 Color Picker */
  html5colorpicker?: string;
}

/** Grouping of Entries for several purpose, pages, apps, etc... */
export interface Composition {
  /** Title */
  title: string;
  /** URL */
  url?: string;
  /** Type */
  type?: "Home: Modern" | "Home: Standard" | "FAQ";
  /** (Masonry) Top Banner */
  top_banner?: {
    /** Rectangular Blocks */
    rectangular_blocks?: [RectangularBlocks, RectangularBlocks];
    /** Square Blocks */
    square_blocks?: [SquareBlocks, SquareBlocks, SquareBlocks, SquareBlocks];
  };
  /** Sliding Banner */
  sliding_banner?: {
    /** Banners */
    banners?: [Banners, Banners, Banners, Banners, Banners];
  };
}
