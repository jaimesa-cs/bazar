import Copyright from "./copyright";
import HandleLoadingOrError from "@components/contentstack/handle-loading-and-error";
import { IFooter } from "@framework/types";
import Widgets from "./widgets";
import { useCompositionQuery } from "@framework/content/get-content";
import { useRouter } from "next/router";

const Footer: React.FC = () => {
  const { locale } = useRouter();
  const {
    data: footer,
    error,
    isLoading,
  } = useCompositionQuery<IFooter>(locale, "footer", [{ key: "url", value: "/footer" }], ["links.links.category"]);

  return (
    <HandleLoadingOrError isLoading={isLoading} error={error}>
      <footer className="border-b-4 border-heading mt-9 md:mt-11 lg:mt-16 3xl:mt-20 pt-2.5 lg:pt-0 2xl:pt-2">
        {footer && footer.widgets && <Widgets widgets={footer.widgets} />}
        {footer && footer.payment && <Copyright payment={footer.payment} copyright={footer.copyright} />}
      </footer>
    </HandleLoadingOrError>
  );
};
export default Footer;
