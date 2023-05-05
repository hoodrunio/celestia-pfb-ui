export const useJsonDownload = () => {
  const download = ({ json, fileName }: { json: object; fileName: string }) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(json)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${fileName}.json`;

    link.click();
  };

  return download;
};
