import { QueryKey } from "react-query";
import { ReactNode } from "react";

export type CollectionsQueryOptionsType = {
  text?: string;
  collection?: string;
  status?: string;
  limit?: number;
};

export type CategoriesQueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};
export type ProductsQueryOptionsType = {
  type: string;
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};
export type QueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};

export type ShopsQueryOptionsType = {
  text?: string;
  shop?: Shop;
  status?: string;
  limit?: number;
};

export type QueryParamsType = {
  queryKey: QueryKey;
  pageParam?: string;
};
export type Attachment = {
  id: string | number;
  thumbnail: string;
  original: string;
};
export type Category = {
  id: number | string;
  name: string;
  slug: string;
  details?: string;
  image?: Attachment;
  icon?: string;
  products?: Product[];
  productCount?: number;
};
export type Collection = {
  id: number | string;
  name: string;
  slug: string;
  details?: string;
  image?: Attachment;
  icon?: string;
  products?: Product[];
  productCount?: number;
};
export type Brand = {
  id: number | string;
  name: string;
  slug: string;
  image?: Attachment;
  background_image?: any;
  [key: string]: unknown;
};
export type Tag = {
  id: string | number;
  name: string;
  slug: string;
};
export type Product = {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  sale_price?: number;
  image: Attachment;
  sku?: string;
  gallery?: Attachment[];
  category?: Category;
  tag?: Tag[];
  meta?: any[];
  description?: string;
  variations?: object;
  [key: string]: unknown;
};
export type OrderItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
};
export type Order = {
  id: string | number;
  name: string;
  slug: string;
  products: OrderItem[];
  total: number;
  tracking_number: string;
  customer: {
    id: number;
    email: string;
  };
  shipping_fee: number;
  payment_gateway: string;
};

export type Shop = {
  id: string | number;
  owner_id: string | number;
  owner_name: string;
  address: string;
  phone: string;
  website: string;
  ratings: string;
  name: string;
  slug: string;
  description: string;
  cover_image: Attachment;
  logo: Attachment;
  socialShare: any;
  created_at: string;
  updated_at: string;
};

// Jaime's code
export type ModularBlockType = "faq" | "email_subscription" | "paragraphs";

export interface ModularBlock {
  type: ModularBlockType;
  block: Faq | EmailSubscription | Paragraphs;
}

export interface BaseNavigationItem {
  id: string;
  path?: string;
  label?: string;
}

export interface NavigationColumn extends BaseNavigationItem {
  columnItems?: NavigationColumnItem[];
}
export interface NavigationColumnItem extends BaseNavigationItem {
  columnItemItems?: BaseNavigationItem[];
}

export interface NavigationItem extends BaseNavigationItem {
  columns?: NavigationColumn[];
  subMenu?: BaseNavigationItem[];
}

export interface LanguageItem {
  id: string;
  name: string;
  value: string;
  icon: JSX.Element;
}
export interface Navigation extends Composition {
  menu: NavigationItem[];
}
export interface FaqQuestion {
  question: string;
  answers: string[];
}

export interface EmailSubscription {
  title: string;
  subtitle: string;
  buttonLabel: string;
  inputPlaceholder: string;
}
export interface Paragraph {
  title: string;
  content: string;
}
export interface Paragraphs {
  paragraphs: Paragraph[];
}

export interface Faq {
  questions: FaqQuestion[];
}

export interface PageHeader {
  title: string;
  subtitle: string;
  banner: Banner;
}

export interface StaticComposition extends Composition {
  header: PageHeader;
  blocks: ModularBlock[];
}

export interface Home extends Composition {
  banner?: Banner[];
  slider?: Banner[];
}

export interface IWidgetItem {
  path?: string;
  title: string;
  icon?: ReactNode;
}
export interface IWidget {
  widgetTitle: string;
  lists: IWidgetItem[];
}

export interface IPayment {
  path?: string;
  name: string;
  image: string;
}

export interface IFooter extends Composition {
  copyright: string;
  widgets: IWidget[];
  payment: IPayment[];
}

export interface Composition {
  title: string;
  url: string;
  type: string;
}

export type Image = {
  url: string;
  width?: number;
  height?: number;
};
export type BannerImages = {
  mobile: Image;
  desktop: Image;
};

export type Banner = {
  id: number;
  title: string;
  slug: string;
  image: BannerImages;
  type: "small" | "medium" | "large";
};
