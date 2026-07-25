import { Dialog } from 'radix-ui';
import * as styles from '~/components/Activity/Activity.css';
import { ActivityTimestamp } from '~/components/Activity/ActivityTimestamp';
import { activityFieldStyles } from '~/styles/mixins';
import { buttonEl } from '~/styles/Page.styled';
import { styledEl } from '~/styles/styledEl';

export { activityFieldStyles };

export const ActivityPanelContainer = styledEl(
  'div',
  styles.activityPanelContainer,
);

export const ActivityListViewport = styledEl(
  'div',
  styles.activityListViewport,
);

export const ActivityListContainer = styledEl(
  'div',
  styles.activityListContainer,
);

export const ActivityListRow = styledEl('div', styles.activityListRow);

export const ActivityHeader = styledEl('div', styles.activityHeader);

export const HideActivityButton = buttonEl(styles.hideActivityButton);

export const AddCommentContainer = styledEl('div', styles.addCommentContainer);

export const ActivityContainer = styledEl('div', styles.activityContainer, [
  'isSelected',
]);

export const ActivityRow = styledEl('div', styles.activityRow);

export const ActivityTitle = styledEl(Dialog.Title, styles.activityTitle);

export const ActivityHeaderTitle = styledEl('div', styles.activityHeaderTitle);

export const ActivityCommentContainer = styledEl(
  'div',
  styles.activityCommentContainer,
);

export const AddCommentForm = styledEl('form', styles.addCommentForm);

export const ActivityMeta = styledEl('div', styles.activityMeta);

export const ActivityAuthorName = styledEl('span', styles.activityAuthorName);

export const ActivityMetaTime = styledEl('span', styles.activityMetaTime);

export const ActivityNameCircle = styledEl('div', styles.activityNameCircle);

export const AddCommentInput = styledEl('input', styles.addCommentInput);

export const ActivityCommentContent = styledEl(
  'div',
  styles.activityCommentContent,
);

export const ActivityEntryContent = styledEl(
  'div',
  styles.activityEntryContent,
);

export const EditCommentActionsRow = styledEl(
  'div',
  styles.editCommentActionsRow,
);

export const SaveCommentButton = buttonEl(styles.saveCommentButton);

export const EditCommentLink = styledEl('button', styles.editCommentLink);

export const DeleteCommentLink = styledEl('button', styles.editCommentLink);

export const EditCommentActionsSeperator = styledEl(
  'div',
  styles.editCommentActionsSeperator,
);

export const ActivityTimestampMeta = styledEl(
  'div',
  styles.activityTimestampMeta,
);

export const ActivityLinkToCard = styledEl('span', styles.activityLinkToCard);

export const CommentTimestamp = styledEl(
  ActivityTimestamp,
  styles.commentTimestamp,
);

export const ActivityLogoSkeleton = styledEl(
  'div',
  styles.activityLogoSkeleton,
);

export const ActivityContentSkeleton = styledEl(
  'div',
  styles.activityContentSkeleton,
);

export const ActivityTimestampSkeleton = styledEl(
  'div',
  styles.activityTimestampSkeleton,
);

export const PaperclipReveal = styledEl('span', styles.paperclipReveal, [
  'isVisible',
]);

export const ActivityCopiedCheckmark = styledEl(
  'span',
  styles.activityCopiedCheckmark,
);
