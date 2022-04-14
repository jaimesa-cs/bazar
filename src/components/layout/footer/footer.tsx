import Copyright from "./copyright";
import HandleLoadingOrError from "@components/contentstack/handle-loading-and-error";
import Widgets from "./widgets";
import { useCommonItems } from "../layout";

const Footer: React.FC = () => {
  const { footer, isLoading, error } = useCommonItems();
  return footer ? (
    <HandleLoadingOrError isLoading={isLoading} error={error}>
      <footer className="border-b-4 border-heading mt-9 md:mt-11 lg:mt-16 3xl:mt-20 pt-2.5 lg:pt-0 2xl:pt-2">
        {footer && footer.widgets && <Widgets widgets={footer.widgets} />}
        {footer && footer.payment && <Copyright payment={footer.payment} copyright={footer.copyright} />}
      </footer>
    </HandleLoadingOrError>
  ) : (
    <> </>
  );
};
export default Footer;
