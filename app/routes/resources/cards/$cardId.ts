import { Params } from "react-router";
import type { ActionFunction, LoaderFunction } from "remix";
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
        .from('cards')
        .update([{
          cardDescription: userData.cardDescription,
        }])
        .match({ id: params.cardId})

      console.log({data, error})

      return data
    }
  }
}

export const loader: LoaderFunction = async ({
  params,
}) => {

  const rows = await client().from('cards').select()

  if(rows.data !== null){
    const card = rows.data.find(value => `${value.id}` === params.cardId );
    return new Response(
      JSON.stringify(card),
      responseOptions
    )
  }

  return new Response(
    JSON.stringify({}),
    responseOptions
  )
};