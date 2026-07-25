import { styled } from '@pigment-css/react';
import { activityFieldStyles } from '~/components/Activity/Activity.styled';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { animationStyles } from '~/styles/animations';
import { Button } from '~/styles/Page.styled';
import { focusRingBlue, listBackground } from '~/styles/tokens';

export const ListGridContainer = styled.div`
  display: grid;
  grid-template-rows: 100% 1fr max-content;
  grid-template-columns: 100px 1fr max-content;
`;

export const ListContainer = styled.div`
  background-color: ${listBackground};
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  height: max-content;
  position: relative;
  white-space: normal;
  width: 275px;
  padding: 0px 8px;
  margin: 0 15px;
  overflow: auto;
`;

export const ListContentContainer = styled.div`
  overscroll-behavior: contain;
  width: 100%;
  min-width: 0;
`;

/**
 * Cards scroll underneath the header and the add-card footer, so those two
 * carry the list's vertical padding themselves — ListContainer only pads the
 * sides, or the gap would show cards passing through it.
 */
export const ListHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  background-color: ${listBackground};
  padding-top: 8px;
`;

export const AddCardFooter = styled.div`
  position: sticky;
  bottom: 0;
  /* Below the header: the list actions popover renders inside it, and an equal
     z-index would let this footer paint over the popover's options. */
  z-index: 1;
  display: flex;
  flex-direction: column;
  background-color: ${listBackground};
  padding-bottom: 8px;

  /* While adding a card the footer rejoins the flow, so the input and its
     buttons scroll with the cards. */
  &[data-editing] {
    position: static;
  }
`;

export const ListName = styled.div` 
  font-family: ${fontFamily};
  color: black;
  font-weight: 700;
  font-size: 14px;
`;

export const EditListNameInput = styled.input`
  border-radius: 8px;
  border: none;
  padding: 9px;
  box-shadow: 0 1px 0 #091e4240;
  font-weight: 600;
  position: relative;
  margin-bottom: 4px;
  font-size: 14px;
`;

export const AddListButton = styled.button({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: 14,
  color: 'white',
  letterSpacing: '0.05rem',
});

export const AddCardButton = styled(Button)` 
  margin: 0;
  padding: 8px;
`;

export const AddCardText = styled.button` 
  border: none;
  background: none;
  font-family: ${fontFamily};
  cursor: pointer;
  font-size: 14px;
  border-radius: 8px;
  padding: 8px;
  margin-top: 4px;
  width: 100%;
  text-align: left;
  
  &:hover {
    background-color: rgba(0, 0, 0, .3);
  }
`;

export const AddCardInput = styled.input` 
  border-radius: 8px;
  border: none;
  padding: 9px;
  box-shadow: 0 1px 0 #091e4240;
  margin: 4px 0px 8px;
  width: stretch;
`;

export const CloseAddCardButton = styled(Button)` 
  border: none;
  color: black;
  padding: 8px;
  background: none;
  cursor: pointer;
  margin: 0 8px;
  font-weight: 600;
  &:hover {
    background-color: rgba(0, 0, 0, .3);
  }
`;

export const ListCardContainer = styled.div` 
  position: relative;
  border-radius: 8px;
  background: #fff;
  font-family: ${fontFamily};
  font-size: 14px;
  padding: 8px;
  box-shadow: 0 1px 0 #091e4240;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;

  &[role='button'] {
    cursor: pointer;

    &:focus {
      outline: 2px solid ${focusRingBlue};
      outline-offset: -2px;
    }
  }
`;

export const ListCardSkeleton = styled(ListCardContainer)({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  ...animationStyles.pulse,
});

export const ListHeaderSkeletonRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ListCardsSkeletonRow = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ListNameSkeleton = styled(ListCardSkeleton)`
  width: 125px;
   margin: 8px 0px 12px 8px;
`;

export const ListCountSkeleton = styled(ListCardSkeleton)`
  width: 20px;
   margin: 8px 0px 12px 8px;
`;

export const AddListButtonSkeleton = styled(ListCardSkeleton)`
  margin: 8px 0px 8px 8px;
  width: 75px;
`;

export const DottedLine = styled.div`
  position: relative;
  top: 3px;
  flex: 50%;
  width: 100%;
  height: 0;
  border-top: 2px dashed #b3b9c4;
`;

export const AddNewCardAtPositionContainer = styled.div`
  position: relative;
  min-height: 8px;
  height: auto;
  cursor: pointer;
`;

export const AddNewCardAtPositionPlus = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  background: #fff;
  padding: 2px 6px 0px;
  color: rgba(0, 0, 0, 0.7);
  border-radius: 2px;
  box-shadow: 0.5px 0.5px 0.5px 0.5px #091e4240; 
  border: ${activityFieldStyles.border};
  border-radius: 5px;
  z-index: 1;
`;
