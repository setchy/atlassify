import { SolidMarkdown } from 'solid-markdown';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/Accordion';
import { URLs, siteMetadata } from '~/constants';

const content = [
  {
    id: '1',
    question: 'How do I authenticate Atlassify with my Atlassian account?',
    answer: `Atlassify supports authentication via an Atlassian API token.\n\nPlease refer to the [official docs](${URLs.ATLASSIAN.API_TOKEN}) for help creating and using an API token.`,
  },
  {
    id: '2',
    question:
      'Something is not working as expected, how can I debug Atlassify?',
    answer:
      'Using **Chrome Developer Tools** (console logs, network requests, etc):\n- All platforms: right click tray icon then _Developer → Toggle Developer Tools_\n- macOS: `command + opt + i`\n- Windows: `ctrl + shift + i`\n- Linux: `ctrl + shift + i`\n\nUsing **Application Log Files**:\n- All platforms: right click tray icon then _Developer → View Application Logs_\n- macOS: `~/Library/Logs/atlassify`\n- Windows: `%USERPROFILE%\\AppData\\Roaming\\atlassify\\logs`\n- Linux: `~/.config/atlassify/logs`',
  },  {
    id: '3',
    question:
      'Does Atlassify support Atlassian Data Center or Server products?',
    answer:
      `Currently Atlassify supports Atlassian Cloud products. If you would like to see support for other product types, please raise a [GitHub issue](${URLs.GITHUB.ISSUES}).`,
  },
  {
    id: '4',
    question: 'How can I contribute to Atlassify?',
    answer: `You can contribute to Atlassify by opening an issue or pull request on GitHub at [${siteMetadata.repo.fullName}](${URLs.GITHUB.REPO}).\n\nCheck out our [open issues](${URLs.GITHUB.ISSUES}) and see if there is any existing ideas that you would like to work on.`,
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
