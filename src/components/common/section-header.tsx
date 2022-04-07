import Link from "@components/ui/link";
import Text from "@components/ui/text";
import { useTranslation } from "next-i18next";

interface Props {
  sectionHeading: string;
  categorySlug?: string;
  className?: string;
  headingSuffix?: string;
  color?: string;
}

const SectionHeader: React.FC<Props> = ({
  sectionHeading = "text-section-title",
  categorySlug,
  className = "pb-0.5 mb-4 md:mb-5 lg:mb-6 2xl:mb-7 3xl:mb-8",
  headingSuffix,
  color,
}) => {
  const { t } = useTranslation("common");
  return (
    <div className={`flex items-center justify-between -mt-2 ${className}`}>
      <Text variant="mediumHeading">
        {t(`${sectionHeading}`)}
        <span style={{ color: color, backgroundColor: color }}>{t(`${headingSuffix}`)}</span>
      </Text>
      {categorySlug && (
        <Link href={categorySlug} className="text-xs lg:text-sm xl:text-base text-heading mt-0.5 lg:mt-1">
          {t("text-see-all-product")}
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
