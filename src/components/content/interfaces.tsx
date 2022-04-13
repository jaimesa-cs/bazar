import { IComposition, IHome, IStaticComposition } from "@framework/types";

export interface IContentPageProps {
  data?: IComposition | IStaticComposition | IHome;
}

export interface IUserProfile {
  id: string;
  colorPreference: string;
  promoText: string;
}
