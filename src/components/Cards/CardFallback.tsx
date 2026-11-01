import {
  CardModalContent,
  CardModalHiddenTitle,
  CardModalOverlay,
  CardModalPortal,
  CardModalRoot,
} from '~/components/Cards/Card.styled';
import { useIsMobile } from '~/hooks/useIsMobile';

export function CardFallback() {
  const isMobile = useIsMobile();

  return (
    <CardModalRoot open>
      <CardModalPortal>
        <CardModalOverlay $reserveMenuSpace={!isMobile}>
          <CardModalContent
            $reserveMenuSpace={!isMobile}
            aria-describedby={undefined}
          >
            <CardModalHiddenTitle>Loading card</CardModalHiddenTitle>
          </CardModalContent>
        </CardModalOverlay>
      </CardModalPortal>
    </CardModalRoot>
  );
}
