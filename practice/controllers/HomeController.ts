const getHome = ({ response }: { response: any }) => {
  response.body = "<html><body>Hello deno</body></html>";
};

export { getHome };
