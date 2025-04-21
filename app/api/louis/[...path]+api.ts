import { type RequestContext } from 'expo-router/server';

const LOUIS_API_URL = 'http://louis.tpfbrain.com:8000';

export async function POST(request: Request, context: RequestContext) {
  try {
    // Get the path parameters and construct the full URL
    const path = context.params.path.join('/');
    const url = `${LOUIS_API_URL}/api/v1/${path}`;
    
    // Forward the request to the Louis API with proper headers
    const louisResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: await request.text(), // Forward the raw body
    });

    // Get the response data first as text
    const responseText = await louisResponse.text();
    
    // Try to parse as JSON to validate the response
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Louis API response as JSON:', responseText);
      return new Response(
        JSON.stringify({
          error: 'Invalid JSON response from Louis API server',
          details: responseText.substring(0, 200) + '...'
        }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    // If the response wasn't OK, return an error
    if (!louisResponse.ok) {
      return new Response(
        JSON.stringify({
          error: 'Louis API server error',
          status: louisResponse.status,
          details: responseData
        }),
        {
          status: louisResponse.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    // Return the successful JSON response
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to connect to Louis API server',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}