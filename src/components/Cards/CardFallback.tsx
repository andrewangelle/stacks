import {
  CardModalContent,
  CardModalHiddenTitle,
  CardModalOverlay,
  CardModalPortal,
  CardModalRoot,
} from '~/components/Cards/Card.styled';

export function CardFallback() {
  return (
    <CardModalRoot data-testid="CardModalRoot" open>
      <CardModalPortal data-testid="CardModalPortal">
        <CardModalOverlay data-testid="CardModalOverlay">
          <CardModalContent
            data-testid="CardModalContent"
            aria-describedby={undefined}
          >
            <CardModalHiddenTitle>Loading card</CardModalHiddenTitle>
          </CardModalContent>
        </CardModalOverlay>
      </CardModalPortal>
    </CardModalRoot>
  );
}
