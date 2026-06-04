import { Checklist } from '~/components/Checklists/Checklist';
import { ChecklistsContainer } from '~/components/Checklists/Checklists.styled';
import { useGetChecklists } from '~/query/checklists';

export function CardChecklists({ cardId }: { cardId: string }) {
  const { data } = useGetChecklists({ cardId });
  return (
    <ChecklistsContainer data-testid="ChecklistsContainer">
      {data?.map((checklist) => (
        <Checklist key={checklist.id} id={checklist.id} />
      ))}
    </ChecklistsContainer>
  );
}
