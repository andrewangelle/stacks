import { CSSProperties, useState } from "react"
import { IoIosArrowDropright, IoIosArrowBack } from "react-icons/io";
import { RiTrelloFill } from "react-icons/ri";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "remix";

import { 
  DrawerContainer, 
  DrawerHeader, 
  DrawerHeaderTitle, 
  BoardsLinkContainer, 
  YourBoardsTitle, 
  FlexColumn, 
  DrawerBoardEntry, 
  CreateBoardBackgroundChoice, 
  BoardTitle 
} from "~/styles";

import { tokenState, useGetBoardQuery, useGetBoardsQuery } from "~/store";

export const sharedDrawerArrowStyles: CSSProperties  = {
  cursor: 'pointer', 
  position: 'absolute',
  top: '24px',
  color: 'white'
}

export function Drawer(){
  const params = useParams();
  const { data: board } = useGetBoardQuery(params.id);
  const [token] = useRecoilState(tokenState)
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { data: boards } = useGetBoardsQuery(
    token?.user.id,
    { skip: !token?.user.id }
  );
  return (
  <>
    {!isDrawerOpen && (
      <IoIosArrowDropright 
        style={{
          ...sharedDrawerArrowStyles,
          background: 'rgba(255, 255, 255, 0.16)',
          zIndex: 2 
        }} 
        onClick={() => setDrawerOpen(true)}
        size={24}
      />
    )}
    <DrawerContainer isOpen={isDrawerOpen} background={board?.boardColor}>
      {isDrawerOpen && (
        <>
          <DrawerHeader>
            {token && (
              <DrawerHeaderTitle>
                <div>{(token as any).user.email}'s workspace</div>
              </DrawerHeaderTitle>
            )}
            <IoIosArrowBack 
              style={{
                ...sharedDrawerArrowStyles,
                right: 0
              }} 
              onClick={() => setDrawerOpen(false)}
              size={24}
            />
          </DrawerHeader>

          <BoardsLinkContainer>
            <RiTrelloFill size={18} style={{color: 'white', padding: '8px'}} />
            <YourBoardsTitle onClick={() => navigate('/boards')}>
              Boards
            </YourBoardsTitle>
          </BoardsLinkContainer>

          <YourBoardsTitle>
            Your boards
          </YourBoardsTitle>

          <FlexColumn>
            {boards?.map(boardEntry => {
              return (
                <DrawerBoardEntry 
                  key={boardEntry.id} 
                  isSelected={boardEntry.id === board?.id}
                  onClick={() => navigate(`/board/${boardEntry.id}`)}
                >
                  <CreateBoardBackgroundChoice 
                    background={boardEntry.boardColor}
                  />
                  <BoardTitle>
                    {boardEntry.boardTitle}
                  </BoardTitle>
                </DrawerBoardEntry>
              )
            })}
          </FlexColumn>

        </>
      )}
    </DrawerContainer>
  </>
  )
}