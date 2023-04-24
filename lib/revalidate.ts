/**
 * Revalidates a user's profile page using Next ISR
 * @param hostname The host to revalidate
 * @param id The user ID to revalidate
 */
export async function revalidate(hostname: string, id: string) {
  const urlPaths = [`/student/${id}`];

  
  await Promise.all(urlPaths.map((urlPath) =>
    fetch(`${hostname}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urlPath,
      })
    })
  ));
}