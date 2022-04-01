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
  }
}