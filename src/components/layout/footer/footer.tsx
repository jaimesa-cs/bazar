import Copyright from "./copyright";
import { IFooter } from "@framework/types";
import Widgets from "./widgets";
import { useCompositionQuery } from "@framework/content/get-content";

const Footer: React.FC = () => {
  const {
    data: footer,
    error,
    isLoading,
  } = useCompositionQuery<IFooter>("/footer", "footer", ["links.links.category"]);

  return isLoading ? (
    <>Loading...</>
  ) : error ? (
    <>Error: {JSON.stringify(error)})</>
  ) : (
    <footer className="border-b-4 border-heading mt-9 md:mt-11 lg:mt-16 3xl:mt-20 pt-2.5 lg:pt-0 2xl:pt-2">
      {footer && footer.widgets && <Widgets widgets={footer.widgets} />}
      {footer && footer.payment && <Copyright payment={footer.payment} />}
    </footer>
  );
};

export default Footer;
