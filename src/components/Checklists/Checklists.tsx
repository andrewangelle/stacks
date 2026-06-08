import { Checklist } from '~/components/Checklists/Checklist';
import { ChecklistsContainer } from '~/components/Checklists/Checklists.styled';
import { useGetChecklists } from '~/query/checklists';

type CardChecklistsProps = {
  cardId: string;
};

export function CardChecklists({ cardId }: CardChecklistsProps) {
  const { data } = useGetChecklists({ cardId });

  return (
    <ChecklistsContainer data-testid="ChecklistsContainer">
      {data?.map((checklist) => (
        <div key={checklist.id}>
          <Checklist id={checklist.id} />
        </div>
      ))}
    </ChecklistsContainer>
  );
}
