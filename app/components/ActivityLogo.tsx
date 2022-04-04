import { useRecoilState } from "recoil";

import { tokenState, useGetProfileQuery } from "~/store";
import { ActivityNameCircle, Center } from "~/styles";

export function getInitials(data: {firstName: string; lastName: string;} | null){
  if(data === null || !data.firstName){
    return 'Anon'
  }

  const {firstName, lastName} = data;
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`
}


export function ActivityLogo(){
  const [token] = useRecoilState(tokenState);
  const profile = useGetProfileQuery(
    {userId: token?.user.id!},
    {skip: !token?.user.id}
  );
  const initials = getInitials(profile.data ?? null);
  return (
    <ActivityNameCircle>
      <Center>
        <div style={{marginTop: '-2px'}}>{initials}</div>
      </Center>
    </ActivityNameCircle>
  )
}