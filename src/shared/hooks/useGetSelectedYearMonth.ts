import { useLocation } from "react-router-dom";

export const useGetSelectedYearMonth = () => {
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const date = new Date();

  return () => {
    let dateQuerystring = urlSearch.get("date") || "";

    if (!dateQuerystring) {
      dateQuerystring =
        date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, "0");
    }

    const year = dateQuerystring.substring(0, 4);
    const month = dateQuerystring.substring(4, 6);

    return { year, month, yearMonth: `${year}${month}` };
  };
};
