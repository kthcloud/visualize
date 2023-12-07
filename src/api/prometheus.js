export const getUsers = async () => {
  const res = await fetch(
    "https://prometheus.cloud.cbh.kth.se/api/v1/query?query=go_deploy_users_total",
    {
      method: "GET",
    }
  );

  let json = await res.json();
  let users = json.data.result[0].value[1];
  return users;
};
