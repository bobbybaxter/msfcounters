export default async function getCounterData() {
  const response = await fetch(process.env.NEXT_PUBLIC_COUNTER_API_URL);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}
