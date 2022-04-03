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
  const userData = await request.json();

  switch(request.method){
    case 'PUT': {
      const { data, error } = await client(userData.token)
        .from('checklist-items')
        .update([{
          label: userData.label,
          isCompleted: userData.isCompleted,
        }])
        .match({ id: params.itemId })

      console.log({ data, error })
      return data
    }

    case 'DELETE': {
      const { data, ...rest } = await client(userData.token)
        .from('checklist-items')
        .delete()
        .match({ id: params.itemId })
       
      console.log({
        data,
        rest
      })
      const responseData = {code: 'checklists:delete:success', message: 'success', data};
      return new Response(JSON.stringify(responseData), responseOptions)
    }
  }
}