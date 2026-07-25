import { Tooltip } from 'radix-ui';
import * as styles from '~/components/shared/Tooltip/Tooltip.css';
import { styledEl } from '~/styles/styledEl';

export const TooltipContent = styledEl(Tooltip.Content, styles.tooltipContent);
