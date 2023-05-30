import { Element, Link } from "react-scroll";
import { EmailSubscription, Faq, ModularBlock, Paragraphs } from "@framework/types";

import Accordion from "@components/common/accordion";
import Container from "@components/ui/container";
import Subscription from "@components/common/subscription";

function makeTitleToDOMId(title: string) {
  return title.toLowerCase().split(" ").join("_");
}

function removePrefix(title: string) {
  const regex = new RegExp("[0-9]+[ ]", "i");
  return title.replace(regex, "");
}
function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

interface RenderModularBlocksProps {
  blocks: ModularBlock[];
}
export default function RenderModularBlocks({ blocks }: RenderModularBlocksProps) {
  return blocks ? (
    <Container>
      {blocks &&
        blocks.map((block: ModularBlock, index: number) => {
          switch (block.type) {
            case "faq":
              const faq: Faq = block.block as Faq;
              return (
                <div className="py-16 lg:py-20 px-0 max-w-5xl mx-auto space-y-4" key={index}>
                  <Accordion
                    items={faq.questions.map((q) => {
                      return {
                        contentKey: q.answers.join("<br/>"),
                        title: q.question,
                        titleKey: q.question,
                        content: q.answers.join("<br/>"),
                      };
                    })}
                    translatorNS="faq"
                  />
                </div>
              );
            case "email_subscription":
              const es = block.block as EmailSubscription;
              return <Subscription data={es} key={index} />;
            case "paragraphs":
              const paragraphs: Paragraphs = block.block as Paragraphs;
              return (
                <div className="flex flex-col md:flex-row" key={index}>
                  <nav className="md:w-72 xl:w-3/12 mb-8 md:mb-0">
                    <ol className="sticky md:top-16 lg:top-28 z-10">
                      {paragraphs.paragraphs?.map((item, index) => (
                        <li key={index}>
                          <Link
                            spy={true}
                            offset={-120}
                            smooth={true}
                            duration={500}
                            to={makeTitleToDOMId(item.title)}
                            activeClass="text-heading font-semibold"
                            className="block cursor-pointer py-3 lg:py-3.5  text-sm lg:text-base  text-gray-700 uppercase"
                          >
                            {(index <= 9 ? "0" : "") + index + " " + `${item.title}`}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </nav>
                  {/* End of section scroll spy menu */}

                  <div className="md:w-9/12 md:ps-8 pt-0 lg:pt-2">
                    {paragraphs.paragraphs?.map((item) => (
                      // @ts-ignore
                      <Element key={item.title} id={makeTitleToDOMId(item.title)} className="mb-10">
                        <h2 className="text-lg md:text-xl lg:text-2xl text-heading font-bold mb-4">
                          {toTitleCase(removePrefix(item.title))}
                        </h2>
                        <div
                          className="text-heading text-sm leading-7 lg:text-base lg:leading-loose"
                          dangerouslySetInnerHTML={{
                            __html: `${item.content}`,
                          }}
                        />
                      </Element>
                    ))}
                  </div>
                  {/* End of content */}
                </div>
              );
          }
        })}
    </Container>
  ) : (
    <></>
  );
}

// export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
//   //TODO: Get the static paths from contentstack
//   return {
//     paths: ["/faq"], //indicates that no page needs be created at build time
//     fallback: "blocking", //indicates the type of fallback
//   };
// };
