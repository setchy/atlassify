import { SolidMarkdown } from 'solid-markdown';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/Accordion';
import { siteMetadata } from '~/constants';

const content = [
  {
    id: '1',
    question: 'Something looks wrong - How can I debug?',
    answer:
      'You can debug Atlasify by pressing:\n- macOS: `command + opt + i`\n- Windows + Linux: `ctrl + shift + i`\n\nThis will open the dev tools and then you can see any logs, network requests etc.',
  },
  {
    id: '2',
    question: 'How can I contribute to Atlasify?',
    answer: `You can contribute to Atlasify by opening a pull request @[${siteMetadata.repo}](https://github.com/${siteMetadata.repo})! Check out our open issues and see if there's anything you'd like to work on.`,
  },
];

export const FaqAccordion = () => {
  return (
    <Accordion multiple collapsible>
      {content.map((item) => (
        <AccordionItem value={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>
            <SolidMarkdown children={item.answer} class="markdown" />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
