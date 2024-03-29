import {
  BaseNavigationItem,
  FaqQuestion,
  IABTest,
  IBanner,
  IComposition,
  IErrorPage,
  IFooter,
  IHome,
  IPayment,
  IStaticComposition,
  IWidget,
  IWidgetItem,
  Navigation,
  NavigationColumn,
  NavigationColumnItem,
  NavigationItem,
  PageHeader,
  Paragraph,
} from "@framework/types";
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter, IoLogoYoutube } from "react-icons/io5";

const NEW_HEADER: PageHeader = {
  title: "",
  subtitle: "",
  banner: {
    url: "",
    image: {
      mobile: {
        url: "",
      },
      desktop: {
        url: "",
      },
    },
    type: "medium",
    slug: "",
    id: 0,
    title: "",
  },
};

export const ABTestBannerSize: BannerSize = {
  mobile: { width: 450, height: 180 },
  desktop: {
    width: 1800,
    height: 570,
  },
  type: "large",
};

const MasonrySquareSize: BannerSize = {
  mobile: { width: 232, height: 232 },
  desktop: {
    width: 425,
    height: 425,
  },
  type: "small",
};
const MasonryRectSizes: BannerSize = {
  desktop: {
    width: 1078,
    height: 425,
  },
  mobile: {
    width: 470,
    height: 232,
  },
  type: "medium",
};

const SlidingRectSizes: BannerSize = {
  desktop: {
    width: 1440,
    height: 570,
  },
  mobile: {
    width: 450,
    height: 180,
  },
  type: "small",
};

export interface BannerSize {
  mobile: {
    width: number;
    height: number;
  };
  desktop: {
    width: number;
    height: number;
  };
  type: "small" | "medium" | "large";
}

export const toBannerFromComposition = (c: any, size: BannerSize): IBanner => {
  const e = c.banner;
  return {
    id: e.image.uid,
    url: "",
    title: e.link.title,
    slug: e.link.href,
    image: {
      mobile: {
        url: e.image.url,
        height: size.mobile.height,
        width: size.mobile.width,
      },
      desktop: {
        url: e.image.url,
        height: size.desktop.height,
        width: size.desktop.width,
      },
    },
    type: size.type,
  };
};

const toBanner = (e: any, size: BannerSize): IBanner => {
  return {
    id: e.image.uid,
    url: "",
    title: e.link.title,
    slug: e.link.href,
    image: {
      mobile: {
        url: e.image.url,
        height: size.mobile.height,
        width: size.mobile.width,
      },
      desktop: {
        url: e.image.url,
        height: size.desktop.height,
        width: size.desktop.width,
      },
    },
    type: size.type,
  };
};

const toBannerList = (s: any): IBanner[] => {
  const slider: IBanner[] = [];
  s.map((e: any) => {
    slider.push(toBanner(e, SlidingRectSizes));
  });
  return slider;
};

const assembleMasonry = (top_banner: any): IBanner[] => {
  const squareBanners: IBanner[] = [];
  const rectBanners: IBanner[] = [];

  if (top_banner.rectangular_blocks) {
    top_banner.rectangular_blocks.map((b: any) => {
      rectBanners.push(toBanner(b, MasonryRectSizes));
    });
  }
  if (top_banner.square_blocks) {
    top_banner.square_blocks.map((b: any) => {
      squareBanners.push(toBanner(b, MasonrySquareSize));
    });
  }

  return [rectBanners[0], ...squareBanners, rectBanners[1]].filter((b) => b !== undefined);
};

const getLinks = (nested: any): NavigationItem[] => {
  const links: NavigationItem[] = [];
  if (nested && nested.length > 0) {
    nested.map((nl: any, index: number) => {
      if (nl.link) {
        links.push({
          id: index.toString(),
          path: nl.link.href,
          label: nl.link.title,
          subMenu: getLinks(nl.nested_links),
        });
      }
    });
  }
  return links;
};

const getColumnItems = (categories: any): NavigationItem[] => {
  const items: NavigationColumn[] = [];
  if (categories && categories.length > 0) {
    categories.map((c: any, index: number) => {
      if (c.link) {
        const item: NavigationColumnItem = {
          id: index.toString(),
          path: c.link.href,
          label: c.link.title,
          columnItemItems: [],
        };

        if (c.categories && c.categories.length > 0) {
          c.categories.map((c2: any, index2: number) => {
            if (c2.link) {
              const subItem: BaseNavigationItem = {
                id: index2.toString(),
                path: c2.link.href,
                label: c2.link.title,
              };
              item.columnItemItems?.push(subItem);
            }
          });
        }
        items.push(item);
      }
    });
  }
  return items;
};

const getFaq = (input: any): FaqQuestion[] => {
  if (input) {
    const faq: FaqQuestion[] = [];
    input.map((q: any) => {
      const question: FaqQuestion = {
        question: q.question,
        answers: [],
      };
      if (q.answers && q.answers.length > 0) {
        q.answers.map((a: any) => {
          question.answers.push(a);
        });
      }
      faq.push(question);
    });

    return faq;
  }
  return [];
};

const getParagraphs = (input: any): Paragraph[] => {
  if (input) {
    const paragraphs: Paragraph[] = [];
    input.map((p: any) => {
      const paragraph: Paragraph = {
        title: p.title,
        content: p.paragraph.toString(),
      };
      paragraphs.push(paragraph);
    });

    return paragraphs;
  }
  return [];
};

const getWidgets = (input: any): IWidget[] => {
  if (input) {
    const widgets: IWidget[] = [];
    input.map((w: any) => {
      const widget: IWidget = {
        widgetTitle: w.list_title,
        lists: [],
      };
      if (w.links && w.links.length > 0) {
        w.links.map((l: any) => {
          let wi: IWidgetItem = {
            path: "",
            title: "",
          };
          //link
          if (l.link && l.link.title && l.link.title.trim() !== "") {
            wi.path = l.link.href;
            wi.title = l.link.title;
          } else if (l.category && l.category.length > 0) {
            //category
            const c: any = l.category[0];
            if (c.link) {
              wi.path = `search?q=${c.url.replace("/", "")}`;
              wi.title = c.link.title;
            }
          }
          //icon
          if (l.icon) {
            switch (l.icon.toLocaleLowerCase()) {
              case "facebook":
                wi.icon = <IoLogoFacebook />;
                break;
              case "twitter":
                wi.icon = <IoLogoTwitter />;
                break;
              case "instagram":
                wi.icon = <IoLogoInstagram />;
                break;
              case "youtube":
                wi.icon = <IoLogoYoutube />;
                break;
              default:
                wi.icon = <></>;
                break;
            }
          }
          widget.lists.push(wi);
        });
      }
      widgets.push(widget);
    });
    return widgets;
  }
  return [];
};

const getPayments = (input: any): IPayment[] => {
  if (input) {
    const payments: IPayment[] = [];
    input.map((p: any) => {
      const payment: IPayment = {
        name: "",
        image: "",
      };

      if (p.link) {
        payment.path = p.link.href;
        payment.name = p.link.title;
      }
      if (p.image) {
        payment.image = p.image.url;
      }
      payments.push(payment);
    });
    return payments;
  }
  return [];
};

const getPageHeader = (input: any): PageHeader => {
  if (input) {
    // console.log("PAGE HEADER", input);
    return {
      ...NEW_HEADER,
      title: input.title,
      subtitle: input.subtitle,
      banner: {
        ...NEW_HEADER.banner,
        image: {
          ...NEW_HEADER.banner.image,
          desktop: {
            url:
              input && input.banner && input.banner.length > 0 && input.banner[0].banner && input.banner[0].banner.image
                ? input.banner[0].banner.image.url
                : "",
          },
        },
      },
    };
  }
  return NEW_HEADER;
};
const getComposition = (input: any, type: string = "composition"): IComposition | undefined => {
  // console.log("COMPOSITION", input);
  if (input === undefined) return input;
  try {
    switch (type) {
      case "banner_variation":
        // console.log("BANNER VARIATION", input);
        const abBanner = toBanner(input.banner, ABTestBannerSize);
        // console.log("ABBanner", abBanner);
        return abBanner;
      case "error_pages":
        // console.log("ERROR PAGE", input);
        const errorPage: IErrorPage = {
          title: input.title,
          url: input.url,
          type: input.type,
          error: input.error_message,
          errorNumber: input.error_number,
        };
        return errorPage;
      case "static_composition":
        // console.log("STATIC COMPOSITION", input);
        const page: IStaticComposition = {
          title: input.title,
          url: input.url,
          type: input.type,
          header: getPageHeader(input.header),
          blocks: [],
        };

        if (input.dynamic_blocks) {
          // console.log("DYNAMIC_BLOCKS", input.dynamic_blocks);
          input.dynamic_blocks.map((db: any) => {
            // console.log("BLOCK", db);
            //FAQ
            if (db.faq && db.faq.questions && db.faq.questions.length > 0) {
              // console.log("FAQ", db.faq);
              page.blocks.push({ type: "faq", block: { questions: getFaq(db.faq.questions) } });
            }

            //EMAIL SUBSCRIPTION
            if (
              db.mail_list_subscription &&
              db.mail_list_subscription.email_subscription &&
              db.mail_list_subscription.email_subscription.length > 0
            ) {
              // console.log("EMAIL SUBSCRIPTION", db.mail_list_subscription);
              const e: any = db.mail_list_subscription.email_subscription[0];
              page.blocks.push({
                type: "email_subscription",
                block: {
                  title: e.title,
                  subtitle: e.subtitle,
                  buttonLabel: e.button_label,
                  inputPlaceholder: e.input_placeholder,
                },
              });
            }
            //PARAGRAPHS
            if (
              db.paragraphs_with_links &&
              db.paragraphs_with_links.paragraphs &&
              db.paragraphs_with_links.paragraphs.length > 0
            ) {
              // console.log("PARAGRAPHS", db.paragraphs_with_links);
              page.blocks.push({
                type: "paragraphs",
                block: {
                  paragraphs: getParagraphs(db.paragraphs_with_links.paragraphs),
                },
              });
            }
          });
        }
        // console.log("PAGE", page);
        return page;
      case "composition":
        // console.log("COMPOSITION (HOME)", input);
        const home: IHome = {
          title: input.title,
          url: input.url,
          type: input.type,
        };

        if (input.top_banner) {
          home.banner = assembleMasonry(input.top_banner);
        }
        if (input.sliding_banner && input.sliding_banner.banners && input.sliding_banner.banners.length > 0) {
          home.slider = toBannerList(input.sliding_banner.banners);
        }
        if (input.personalization && input.personalization.personalization_options) {
          home.personalization = input.personalization.personalization_options;
        }

        if (input.a_b_testing) {
          let abTesting: IABTest = { default: undefined, variant_a: undefined, variant_b: undefined };
          if (input.a_b_testing.default) {
            abTesting.default = toBanner(input.a_b_testing.default, ABTestBannerSize);
          }
          if (input.a_b_testing.variant_a) {
            abTesting.variant_a = toBanner(input.a_b_testing.variant_a, ABTestBannerSize);
          }
          if (input.a_b_testing.variant_b) {
            abTesting.variant_b = toBanner(input.a_b_testing.variant_b, ABTestBannerSize);
          }

          if (input.a_b_testing.campaign) {
            abTesting.campaign = input.a_b_testing.campaign;
          }

          home.abTesting = abTesting;
        }
        // console.log("HOME", home);
        return home;

      case "footer":
        // console.log("FOOTER", input);
        const footer: IFooter = {
          title: input.title,
          url: input.url,
          type: type,
          copyright: input.copyright,
          widgets: [],
          payment: [],
        };
        if (input.links && input.links.length > 0) {
          footer.widgets.push(...getWidgets(input.links));
        }
        if (input.payment_methods && input.payment_methods.links && input.payment_methods.links.length > 0) {
          footer.payment.push(...getPayments(input.payment_methods.links));
        }

        return footer;
      case "navigation":
        // console.log("NAVIGATION", input);
        const menu: NavigationItem[] = [];
        if (input.links) {
          input.links.map((e: any, index: number) => {
            if (e.category && e.category.length > 0) {
              //Is Category!
              const column: NavigationItem = {
                id: index.toString(),
                path: e.category[0].url,
                label: e.category[0].title,
                columns: [],
              };

              const columnItem: NavigationColumn = {
                id: index.toString(),
                path: `search?q=${e.category[0].url.replace("/", "")}`,
                label: e.category[0].title,
                columnItems: getColumnItems(e.category[0].categories),
              };
              column.columns?.push(columnItem);
              menu.push(column);
            } else if (e.link) {
              //Is Link!
              menu.push({
                id: index.toString(),
                path: e.link.href,
                label: e.link.title,
                subMenu: getLinks(e.nested_links),
              });
            }
          });
        }

        const nav: Navigation = {
          menu: menu,
          title: input.title,
          url: input.url,
          type: input.type,
        };
        // console.log("Navigation", nav);
        return nav;
    }
  } catch (e) {
    console.log("ERROR", e);
    return undefined;
  }
  throw `Mapping for type '${type}' not implemented.`;
};

export const mapper = () => {
  return {
    toComposition: <T extends IComposition>(input: any, type?: string): T | undefined => {
      const c = getComposition(input, type);
      if (c !== undefined) {
        return c as T;
      }
      return undefined;
    },
  };
};
