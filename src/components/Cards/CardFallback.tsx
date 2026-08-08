import {
  CardModalContent,
  CardModalHiddenTitle,
  CardModalOverlay,
  CardModalPortal,
  CardModalRoot,
} from '~/components/Cards/Card.styled';

export function CardFallback() {
  return (
    <CardModalRoot open>
      <CardModalPortal>
        <CardModalOverlay>
          <CardModalContent aria-describedby={undefined}>
            <CardModalHiddenTitle>Loading card</CardModalHiddenTitle>
          </CardModalContent>
        </CardModalOverlay>
      </CardModalPortal>
    </CardModalRoot>
  );
}
