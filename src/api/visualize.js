export const getStatus = async () => {
  const res = await fetch(import.meta.env.VITE_API_URL, {
    method: "GET",
  });

  return res.json();
};
