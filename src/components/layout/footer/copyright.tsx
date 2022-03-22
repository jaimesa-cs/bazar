import Container from "@components/ui/container";
import { IPayment } from "@framework/types";
import parse from "html-react-parser";
import { siteSettings } from "@settings/site-settings";
import { useTranslation } from "next-i18next";

interface CopyrightProps {
  payment?: IPayment[];
  copyright?: string;
}
const year = new Date().getFullYear();
const Copyright: React.FC<CopyrightProps> = ({ payment, copyright }) => {
  const { t } = useTranslation("footer");

  return (
    <div className="border-t border-gray-300 pt-5 pb-16 sm:pb-20 md:pb-5 mb-2 sm:mb-0">
      <Container className="flex flex-col-reverse md:flex-row text-center md:justify-between">
        <div className="text-body text-xs lg:text-sm leading-6">{parse(copyright || "")}</div>

        {payment && (
          <ul className="hidden md:flex flex-wrap justify-center items-center space-s-4 xs:space-s-5 lg:space-s-7 mb-1 md:mb-0 mx-auto md:mx-0">
            {payment?.map((item, index) => (
              <li className="mb-2 md:mb-0 transition hover:opacity-80" key={`payment-list--key${index}`}>
                <a href={item.path ? item.path : "/#"} target="_blank">
                  <img src={item.image} alt={t(`${item.name}`)} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
};

export default Copyright;
