import { assignInlineVars } from '@vanilla-extract/dynamic';
import { Accordion, Checkbox } from 'radix-ui';
import type { ComponentPropsWithRef } from 'react';
import * as styles from '~/components/Lists/CardTitleDetails/CardTitleDetails.css';
import { styledEl } from '~/styles/styledEl';

export const ListCardTitleDetailsContainer = styledEl(
  'div',
  styles.listCardTitleDetailsContainer,
  ['isCompleted'],
);

type CardCompletedIndicatorCircleProps = ComponentPropsWithRef<'button'> & {
  circleSize?: string;
};

export function CardCompletedIndicatorCircle({
  circleSize,
  className,
  style,
  ...props
}: CardCompletedIndicatorCircleProps) {
  return (
    <button
      {...props}
      className={
        className
          ? `${styles.cardCompletedIndicatorCircle} ${className}`
          : styles.cardCompletedIndicatorCircle
      }
      style={
        circleSize
          ? {
              ...assignInlineVars({ [styles.circleSizeVar]: circleSize }),
              ...style,
            }
          : style
      }
    />
  );
}

export const CardTitleDetailsChecklistTotalsContainer = styledEl(
  'div',
  styles.cardTitleDetailsChecklistTotalsContainer,
  ['isOpen', 'isAllCompleted'],
);

export const CardTitleDetailsChecklistDivider = styledEl(
  'div',
  styles.cardTitleDetailsChecklistDivider,
);

export const CardTitleDetailsChecklistAccordionRoot = styledEl(
  Accordion.Root,
  styles.cardTitleDetailsChecklistAccordionRoot,
);

export const CardTitleDetailsChecklistAccordionItem = styledEl(
  Accordion.Item,
  styles.cardTitleDetailsChecklistAccordionItem,
);

export const CardTitleDetailsChecklistAccordionHeader = styledEl(
  Accordion.Header,
  styles.cardTitleDetailsChecklistAccordionHeader,
);

export const CardTitleDetailsChecklistAccordionChevron = styledEl(
  'span',
  styles.cardTitleDetailsChecklistAccordionChevron,
);

export const CardTitleDetailsChecklistAccordionTrigger = styledEl(
  Accordion.Trigger,
  styles.cardTitleDetailsChecklistAccordionTrigger,
);

export const CardTitleDetailsChecklistAccordionTitle = styledEl(
  'span',
  styles.cardTitleDetailsChecklistAccordionTitle,
);

export const CardTitleDetailsChecklistAccordionCount = styledEl(
  'span',
  styles.cardTitleDetailsChecklistAccordionCount,
);

export const CardTitleDetailsChecklistAccordionContent = styledEl(
  Accordion.Content,
  styles.cardTitleDetailsChecklistAccordionContent,
);

export const CardTitleDetailsChecklistContainer = styledEl(
  'div',
  styles.cardTitleDetailsChecklistContainer,
);

export const CardTitleDetailsChecklistItemRow = styledEl(
  'div',
  styles.cardTitleDetailsChecklistItemRow,
);

export const CardTitleDetailsChecklistCheckbox = styledEl(
  Checkbox.Root,
  styles.cardTitleDetailsChecklistCheckbox,
);

export const CardTitleDetailsChecklistCheckboxIndicator = styledEl(
  Checkbox.Indicator,
  styles.cardTitleDetailsChecklistCheckboxIndicator,
);

export const CardTitleDetailsChecklistItemLabel = styledEl(
  'span',
  styles.cardTitleDetailsChecklistItemLabel,
);

export const CardTitleDetailsChecklistShowMore = styledEl(
  'button',
  styles.cardTitleDetailsChecklistShowMore,
);

type ContentIconsContainerProps = ComponentPropsWithRef<'div'> & {
  commentsCount: number;
};

export function CardTitleDetailsContentIconsContainer({
  commentsCount,
  className,
  ...props
}: ContentIconsContainerProps) {
  const bound = styles.cardTitleDetailsContentIconsContainer({
    hasComments: commentsCount > 0,
  });
  return (
    <div {...props} className={className ? `${bound} ${className}` : bound} />
  );
}

export const CardTitleDetailsSpinnerContainer = styledEl(
  'div',
  styles.cardTitleDetailsSpinnerContainer,
);

export const CardTitleDetailsSpinner = styledEl(
  'div',
  styles.cardTitleDetailsSpinner,
);

export const CardTitleDetailsContentSkeleton = styledEl(
  'div',
  styles.cardTitleDetailsContentSkeleton,
);

export const AllTasksCompletedContainer = styledEl(
  'div',
  styles.allTasksCompletedContainer,
);

export const AllTasksCompletedText = styledEl(
  'div',
  styles.allTasksCompletedText,
);
