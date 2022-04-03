import { Params } from "react-router";
import type { ActionFunction } from "remix";
import client from '~/modules/supabase';

const responseOptions = {
  status: 200,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const action: ActionFunction = async ({
  request,
  params,
}: {
  request: Request,
  params: Params<string>
}) => {
  switch(request.method){
    case 'PUT': {
      const userData = await request.json();

      console.log(userData)

      const { data, error } = await client(userData.token)
        .from('lists')
        .update([{
          listTitle: userData.listTitle,
        }])
        .match({ id: params.listId })

      console.log({data, error})

      return data

    }
    case 'DELETE': {
      const userData = await request.json()
      const { data } = await client(userData.token)
        .from('lists')
        .delete()
        .match({ id: userData.id });

      const { data: cardData } = await client(userData.token)
        .from('cards')
        .delete()
        .match({ listId: userData.id })

      const { data: checklistData } = await client(userData.token)
        .from('checklists')
        .delete()
        .match({ listId: userData.id });

      const { data: checklistItemData } = await client(userData.token)
        .from('checklist-items')
        .delete()
        .match({ listId: userData.id });     
       
      console.log({
        data,
        cardData,
        checklistData,
        checklistItemData
      })
      const responseData = {code: 'lists:delete:success', message: 'success', data};
      return new Response(JSON.stringify(responseData), responseOptions)
    }
  }
}